"""
Rule-based stock analysis for PSX companies.

All verdicts use simple rules comparing financial metrics.
Summary points are written in plain English for non-finance users.
"""

import json
import logging
import math
import re
from datetime import datetime, timedelta
from pathlib import Path

from models import (
    AnalysisResult,
    CompanyInfo,
    EquityData,
    FinancialYear,
    PayoutRecord,
    PriceData,
    RatioYear,
    ValueCheck,
)


_logger = logging.getLogger(__name__)


# Graham Number constant: 22.5 = max P/E (15) × max P/B (1.5)
# from Benjamin Graham's "The Intelligent Investor"
_GRAHAM_CONSTANT = 22.5


# ── Face value lookup ──────────────────────────────────────────────────────
# PSX dividend announcements quote "% of face value" so we need each stock's
# face value to convert to PKR. The bulk of values come from the PSX-published
# face-value PDF, extracted by `scripts/extract_face_values.py` into
# `face_values.json` (~540 listed equities).
#
# `_FACE_VALUE_OVERRIDES` covers symbols where the PDF is stale or missing —
# typically because PSX hasn't reissued the PDF since a stock split or merger.
# Override always wins over the JSON; JSON wins over the Rs. 10 default.

_FACE_VALUE_OVERRIDES: dict[str, float] = {
    "SYS": 2.0,        # 1:5 split in 2024; PSX PDF still shows pre-split Rs. 10
    "ENGROH": 10.0,    # New entity from Dec 2024 Engro Corp / Dawood Hercules merger
}
_DEFAULT_FACE_VALUE_PKR = 10.0
_FACE_VALUES_JSON = Path(__file__).resolve().parent / "face_values.json"


def _load_face_values_from_json() -> dict[str, float]:
    """Load symbol → face value from the PSX-published JSON. Empty dict on any
    failure — caller falls back to overrides + Rs. 10 default."""
    try:
        raw = json.loads(_FACE_VALUES_JSON.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, OSError) as e:
        _logger.warning("Could not load face_values.json: %s", e)
        return {}
    out: dict[str, float] = {}
    for symbol, entry in raw.items():
        try:
            fv = float(entry["face_value"]) if isinstance(entry, dict) else float(entry)
        except (KeyError, TypeError, ValueError):
            continue
        out[symbol.upper()] = fv
    return out


_FACE_VALUE_TABLE: dict[str, float] = _load_face_values_from_json()
_logger.info("Loaded %d face values from JSON", len(_FACE_VALUE_TABLE))


def face_value_for(symbol: str) -> float:
    """Face value (par value) per share in PKR. Lookup order:
    overrides → JSON table → Rs. 10 default."""
    sym = symbol.strip().upper()
    if sym in _FACE_VALUE_OVERRIDES:
        return _FACE_VALUE_OVERRIDES[sym]
    return _FACE_VALUE_TABLE.get(sym, _DEFAULT_FACE_VALUE_PKR)


# ── Investor metrics: trailing-12mo payout ratio + ROE ─────────────────────


_PERCENT_RE = re.compile(r"([\d.]+)\s*%")
_PAYOUT_DATE_RE = re.compile(r"^(\w+)\s+(\d{1,2}),?\s+(\d{4})")


def _parse_payout_date(date_str: str | None) -> datetime | None:
    """Parse 'April 7, 2026 3:57 PM' or 'Apr 7, 2026' → datetime."""
    if not date_str:
        return None
    m = _PAYOUT_DATE_RE.match(date_str.strip())
    if not m:
        return None
    for fmt in ("%B %d %Y", "%b %d %Y"):
        try:
            return datetime.strptime(f"{m.group(1)} {m.group(2)} {m.group(3)}", fmt)
        except ValueError:
            continue
    return None


def _trailing_cash_dividend_pct(payouts: list[PayoutRecord]) -> float | None:
    """Sum of cash-dividend percentages declared in the last 12 months.
    Skips bonus shares (B) and rights issues (R). Returns None when no
    parseable cash dividend is found in the window."""
    if not payouts:
        return None
    cutoff = datetime.now() - timedelta(days=365)
    total = 0.0
    found = False
    for p in payouts:
        details = (p.details or "").upper()
        if "CASH DIVIDEND" not in details and "(D)" not in details:
            continue
        when = _parse_payout_date(p.date)
        if when is None or when < cutoff:
            continue
        m = _PERCENT_RE.search(p.details or "")
        if not m:
            continue
        try:
            total += float(m.group(1))
            found = True
        except ValueError:
            continue
    return total if found else None


def calculate_payout_ratio(
    payouts: list[PayoutRecord],
    financials_annual: list[FinancialYear],
    symbol: str,
) -> float | None:
    """Payout Ratio = (DPS / EPS) × 100.
        DPS (PKR) = (sum of trailing-12-month cash-dividend %) × Face Value / 100
    Returns None when EPS or trailing dividends are missing.
    """
    eps = next((f.eps for f in financials_annual if f.eps is not None), None)
    if eps is None or eps <= 0:
        return None
    pct_total = _trailing_cash_dividend_pct(payouts)
    if pct_total is None:
        return None
    dps_pkr = (pct_total / 100.0) * face_value_for(symbol)
    return (dps_pkr / eps) * 100.0


def calculate_dividend_yield(
    payouts: list[PayoutRecord],
    current_price: float | None,
    symbol: str,
) -> float | None:
    """Trailing 12-month Dividend Yield = (DPS / Current Price) × 100.
        DPS (PKR) = (sum of trailing-12-month cash-dividend %) × Face Value / 100
    Returns None when there's no recent cash dividend or no current price.
    """
    if current_price is None or current_price <= 0:
        return None
    pct_total = _trailing_cash_dividend_pct(payouts)
    if pct_total is None:
        return None
    dps_pkr = (pct_total / 100.0) * face_value_for(symbol)
    return (dps_pkr / current_price) * 100.0


def calculate_roe(
    financials_annual: list[FinancialYear],
    book_value_per_share: float | None,
) -> float | None:
    """Return on Equity = (EPS / BVPS) × 100. Returns None when book value
    is unavailable (Yahoo blocked) — caller renders 'N/A'."""
    if book_value_per_share is None or book_value_per_share <= 0:
        return None
    eps = next((f.eps for f in financials_annual if f.eps is not None), None)
    if eps is None:
        return None
    return (eps / book_value_per_share) * 100.0


def calculate_price_cagr(price_history, years: int = 5) -> float | None:
    """Compound Annual Growth Rate of the share price over the requested span.

        CAGR = (Latest Price / Earliest Price) ^ (1 / years_actual) − 1

    Falls back to whatever span PSX EOD gives us (~5 years). Returns the
    result as a percent, or None when there's less than 1 year of data.
    """
    if not price_history or len(price_history) < 2:
        return None

    sorted_points = sorted(price_history, key=lambda p: p.date)
    latest = sorted_points[-1]
    if latest.close is None or latest.close <= 0:
        return None

    try:
        latest_dt = datetime.strptime(latest.date, "%Y-%m-%d")
    except (ValueError, TypeError):
        return None
    target_dt = latest_dt - timedelta(days=int(365 * years))

    # Find the data point closest to (but not after) `target_dt`. If we don't
    # have that much history, fall back to the earliest point we do have.
    chosen = sorted_points[0]
    chosen_dt: datetime | None = None
    for point in sorted_points:
        try:
            point_dt = datetime.strptime(point.date, "%Y-%m-%d")
        except (ValueError, TypeError):
            continue
        if point_dt <= target_dt:
            chosen = point
            chosen_dt = point_dt
        else:
            break
    if chosen_dt is None:
        try:
            chosen_dt = datetime.strptime(chosen.date, "%Y-%m-%d")
        except (ValueError, TypeError):
            return None

    if chosen.close is None or chosen.close <= 0:
        return None

    span_days = (latest_dt - chosen_dt).days
    if span_days < 365:
        return None
    span_years = span_days / 365.25
    return ((latest.close / chosen.close) ** (1 / span_years) - 1) * 100.0


def _assess_valuation(pe_ratio: float | None) -> str:
    """Valuation based on P/E ratio (PSX context)."""
    if pe_ratio is None:
        return "unknown"
    if pe_ratio < 0:
        return "loss_making"
    if pe_ratio < 15:
        return "undervalued"
    if pe_ratio <= 25:
        return "fairly_valued"
    return "overvalued"


def _assess_business_verdict(
    ratios: list[RatioYear],
    financials: list[FinancialYear],
) -> str:
    """Business verdict based on profit margins and consistency."""
    if not ratios and not financials:
        return "unknown"

    margins = [r.net_profit_margin for r in ratios if r.net_profit_margin is not None]
    profits = [f.profit_after_tax for f in financials if f.profit_after_tax is not None]

    if not margins and not profits:
        return "unknown"

    # Check if consistently profitable
    all_profitable = all(p > 0 for p in profits) if profits else True

    avg_margin = sum(margins) / len(margins) if margins else 0

    if all_profitable and avg_margin > 20:
        return "strong"
    if all_profitable and avg_margin > 10:
        return "moderate"
    if not all_profitable:
        return "weak"
    return "moderate"


def _assess_financial_health(
    financials: list[FinancialYear],
    ratios: list[RatioYear],
) -> str:
    """Financial health based on EPS trend, profit growth, income stability."""
    if not financials:
        return "unknown"

    eps_values = [f.eps for f in financials if f.eps is not None]
    profits = [f.profit_after_tax for f in financials if f.profit_after_tax is not None]
    eps_growths = [r.eps_growth for r in ratios if r.eps_growth is not None]

    if not eps_values and not profits:
        return "unknown"

    # Check if EPS is growing (compare most recent to oldest available)
    eps_trending_up = False
    if len(eps_values) >= 2:
        eps_trending_up = eps_values[0] > eps_values[-1]

    # Count positive EPS growth years
    positive_growth_count = sum(1 for g in eps_growths if g > 0)

    # All profits positive?
    all_positive = all(p > 0 for p in profits) if profits else False

    if all_positive and eps_trending_up and positive_growth_count >= len(eps_growths) // 2:
        return "healthy"
    if all_positive:
        return "stable"
    return "concerning"


def _assess_dividend_status(payouts: list) -> str:
    """Dividend status based on payout history."""
    if not payouts:
        return "none"
    if len(payouts) >= 3:
        return "consistent"
    if len(payouts) >= 1:
        return "irregular"
    return "none"


def _assess_risk_level(
    valuation: str,
    business_verdict: str,
    financial_health: str,
    dividend_status: str,
) -> str:
    """Composite risk assessment."""
    score = 0

    # Valuation risk
    if valuation == "overvalued":
        score += 2
    elif valuation == "fairly_valued":
        score += 1
    elif valuation == "loss_making":
        score += 3

    # Business risk
    if business_verdict == "weak":
        score += 2
    elif business_verdict == "moderate":
        score += 1

    # Health risk
    if financial_health == "concerning":
        score += 2
    elif financial_health == "stable":
        score += 1

    # Dividend risk
    if dividend_status == "none":
        score += 1

    if score <= 2:
        return "low"
    if score <= 5:
        return "moderate"
    return "high"


def _generate_summary_points(
    company: CompanyInfo,
    price: PriceData,
    equity: EquityData,
    financials: list[FinancialYear],
    ratios: list[RatioYear],
    payouts: list,
    valuation: str,
    business_verdict: str,
    financial_health: str,
) -> list[str]:
    """Generate 4-6 plain English summary points."""
    points: list[str] = []

    # Profitability assessment
    profits = [f.profit_after_tax for f in financials if f.profit_after_tax is not None]
    if profits:
        all_positive = all(p > 0 for p in profits)
        if all_positive:
            points.append(
                f"The company has been consistently profitable for the past {len(profits)} years."
            )
        else:
            loss_years = sum(1 for p in profits if p <= 0)
            points.append(
                f"The company had losses in {loss_years} out of the last {len(profits)} years, "
                "which raises some concern."
            )

    # Profit margin insight
    margins = [r.net_profit_margin for r in ratios if r.net_profit_margin is not None]
    if margins:
        latest_margin = margins[0]
        if latest_margin > 50:
            points.append(
                f"Net profit margin is very high ({latest_margin:.0f}%), meaning most of "
                "what they earn becomes profit."
            )
        elif latest_margin > 20:
            points.append(
                f"Net profit margin of {latest_margin:.0f}% is strong - the company keeps "
                "a good chunk of its revenue as profit."
            )
        elif latest_margin > 10:
            points.append(
                f"Net profit margin of {latest_margin:.0f}% is moderate - typical for many industries."
            )
        else:
            points.append(
                f"Net profit margin of {latest_margin:.0f}% is relatively thin, meaning "
                "they keep very little of each rupee earned."
            )

    # EPS trend
    eps_growths = [r.eps_growth for r in ratios if r.eps_growth is not None]
    if eps_growths:
        latest_growth = eps_growths[0]
        if latest_growth > 50:
            points.append(
                f"Earnings per share grew by {latest_growth:.0f}% recently - a very strong jump."
            )
        elif latest_growth > 0:
            points.append(
                f"Earnings per share grew by {latest_growth:.1f}% recently, showing the company "
                "is increasing what each share earns."
            )
        elif latest_growth < -10:
            points.append(
                f"Earnings per share dropped by {abs(latest_growth):.1f}% recently, "
                "meaning each share earned less than before."
            )
        else:
            points.append(
                "Earnings per share have been roughly stable."
            )

    # Valuation
    if price.pe_ratio is not None:
        pe = price.pe_ratio
        if valuation == "overvalued":
            points.append(
                f"P/E ratio of {pe:.1f} means the stock is relatively expensive compared "
                "to its earnings - investors are paying a premium."
            )
        elif valuation == "undervalued":
            points.append(
                f"P/E ratio of {pe:.1f} suggests the stock is cheap relative to earnings - "
                "it could be a good value."
            )
        elif valuation == "fairly_valued":
            points.append(
                f"P/E ratio of {pe:.1f} suggests the stock is reasonably priced for what "
                "the company earns."
            )
        elif valuation == "loss_making":
            points.append(
                "The company currently has a negative P/E ratio, meaning it is losing money."
            )

    # Free float / liquidity
    if equity.free_float_percent is not None:
        ff = equity.free_float_percent
        if ff >= 70:
            points.append(
                f"Free float of {ff:.0f}% means the stock is highly liquid - "
                "easy to buy and sell on the market."
            )
        elif ff >= 30:
            points.append(
                f"Free float of {ff:.0f}% provides reasonable liquidity for trading."
            )
        else:
            points.append(
                f"Free float is only {ff:.0f}%, meaning most shares are held by insiders "
                "and it may be harder to trade."
            )

    # Dividends
    if payouts:
        points.append(
            f"The company has paid dividends {len(payouts)} time(s) recently, "
            "which is a positive sign for investors seeking regular income."
        )
    else:
        points.append(
            "No recent dividend history was found, so this stock is not paying regular "
            "returns to shareholders."
        )

    # Year performance
    if price.year_change_percent is not None:
        yc = price.year_change_percent
        if yc > 0:
            points.append(
                f"The stock price is up {yc:.1f}% over the past year."
            )
        elif yc < 0:
            points.append(
                f"The stock price is down {abs(yc):.1f}% over the past year."
            )

    # Keep to 4-6 points
    return points[:6]


def calculate_value_check(
    price: PriceData,
    financials_annual: list[FinancialYear],
    book_value: float | None,
) -> ValueCheck:
    """
    Calculate intrinsic value using the Graham Number and the margin of safety.

    Graham Number = sqrt(22.5 × EPS × Book Value per Share)
    Margin of Safety = (Intrinsic Value − Market Price) / Intrinsic Value
    """
    eps = next(
        (f.eps for f in financials_annual if f.eps is not None),
        None,
    )
    current = price.current

    # Need positive EPS, positive book value, and a current price
    if eps is None or book_value is None or current is None:
        return ValueCheck(
            verdict="not_applicable",
            explanation=(
                "Not enough data to calculate intrinsic value. We need positive earnings "
                "per share, book value per share, and a current market price."
            ),
            eps_used=eps,
            book_value_used=book_value,
            current_price=current,
        )

    if eps <= 0 or book_value <= 0:
        return ValueCheck(
            verdict="not_applicable",
            explanation=(
                "The Graham Number only works for profitable companies with positive "
                "book value. This company does not meet that condition right now."
            ),
            eps_used=eps,
            book_value_used=book_value,
            current_price=current,
        )

    intrinsic = math.sqrt(_GRAHAM_CONSTANT * eps * book_value)
    margin = (intrinsic - current) / intrinsic

    if margin >= 0.30:
        verdict = "undervalued"
        explanation = (
            f"The stock looks undervalued. Its Graham Number is around Rs. {intrinsic:.2f}, "
            f"but it trades at Rs. {current:.2f} — a margin of safety of {margin * 100:.0f}%."
        )
    elif margin >= 0:
        verdict = "fair"
        explanation = (
            f"The stock looks fairly priced. Its Graham Number is around Rs. {intrinsic:.2f} "
            f"versus a market price of Rs. {current:.2f} — a small {margin * 100:.0f}% buffer."
        )
    else:
        verdict = "overvalued"
        explanation = (
            f"The stock looks expensive on this measure. Its Graham Number is around "
            f"Rs. {intrinsic:.2f} but it trades higher at Rs. {current:.2f}, meaning you "
            f"would pay {abs(margin) * 100:.0f}% above the calculated fair value."
        )

    return ValueCheck(
        intrinsic_value=round(intrinsic, 2),
        current_price=current,
        margin_of_safety=round(margin, 4),
        verdict=verdict,
        explanation=explanation,
        eps_used=eps,
        book_value_used=book_value,
    )


def analyze(
    company: CompanyInfo,
    price: PriceData,
    equity: EquityData,
    financials_annual: list[FinancialYear],
    ratios: list[RatioYear],
    payouts: list,
) -> AnalysisResult:
    """Run rule-based analysis on scraped company data."""
    valuation = _assess_valuation(price.pe_ratio)
    business_verdict = _assess_business_verdict(ratios, financials_annual)
    financial_health = _assess_financial_health(financials_annual, ratios)
    dividend_status = _assess_dividend_status(payouts)
    risk_level = _assess_risk_level(valuation, business_verdict, financial_health, dividend_status)

    summary_points = _generate_summary_points(
        company=company,
        price=price,
        equity=equity,
        financials=financials_annual,
        ratios=ratios,
        payouts=payouts,
        valuation=valuation,
        business_verdict=business_verdict,
        financial_health=financial_health,
    )

    # Ensure we have at least 4 points
    if len(summary_points) < 4:
        summary_points.append(
            f"{company.name} operates in the {company.sector} sector."
        )

    return AnalysisResult(
        business_verdict=business_verdict,
        financial_health=financial_health,
        dividend_status=dividend_status,
        valuation=valuation,
        risk_level=risk_level,
        summary_points=summary_points,
    )
