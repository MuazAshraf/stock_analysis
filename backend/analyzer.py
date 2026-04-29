"""
Rule-based stock analysis for PSX companies.

All verdicts use simple rules comparing financial metrics.
Summary points are written in plain English for non-finance users.
"""

import math

from models import (
    AnalysisResult,
    CompanyInfo,
    EquityData,
    FinancialYear,
    PriceData,
    RatioYear,
    ValueCheck,
)


# Graham Number constant: 22.5 = max P/E (15) × max P/B (1.5)
# from Benjamin Graham's "The Intelligent Investor"
_GRAHAM_CONSTANT = 22.5


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
