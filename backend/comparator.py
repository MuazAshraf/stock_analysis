"""
Side-by-side stock comparison logic.

Compares two analyzed stocks across 7 key metrics and produces a plain English verdict.
"""

from models import AnalyzeResponse, ComparisonMetric, ComparisonResult


def _compare_pe(a: AnalyzeResponse, b: AnalyzeResponse) -> ComparisonMetric:
    """Compare P/E ratios. Lower positive P/E is better (cheaper)."""
    pe_a = a.price.pe_ratio
    pe_b = b.price.pe_ratio
    name_a = a.company.symbol
    name_b = b.company.symbol

    display_a = f"{pe_a:.2f}" if pe_a is not None else "N/A"
    display_b = f"{pe_b:.2f}" if pe_b is not None else "N/A"

    winner = "tie"
    explanation = "P/E data is not available for both stocks."

    if pe_a is not None and pe_b is not None:
        # Negative P/E means loss-making, which is worse
        a_valid = pe_a > 0
        b_valid = pe_b > 0

        if a_valid and b_valid:
            if abs(pe_a - pe_b) < 1.0:
                winner = "tie"
                explanation = "Both stocks have similar P/E ratios."
            elif pe_a < pe_b:
                winner = "a"
                explanation = f"{name_a} is cheaper relative to its earnings."
            else:
                winner = "b"
                explanation = f"{name_b} is cheaper relative to its earnings."
        elif a_valid and not b_valid:
            winner = "a"
            explanation = f"{name_b} is loss-making (negative P/E), while {name_a} is profitable."
        elif not a_valid and b_valid:
            winner = "b"
            explanation = f"{name_a} is loss-making (negative P/E), while {name_b} is profitable."
        else:
            winner = "tie"
            explanation = "Both stocks have negative P/E ratios (loss-making)."
    elif pe_a is not None:
        winner = "a"
        explanation = f"P/E data is only available for {name_a}."
    elif pe_b is not None:
        winner = "b"
        explanation = f"P/E data is only available for {name_b}."

    return ComparisonMetric(
        label="P/E Ratio (Price to Earnings)",
        description="Lower means cheaper relative to earnings",
        value_a=pe_a,
        value_b=pe_b,
        display_a=display_a,
        display_b=display_b,
        winner=winner,
        explanation=explanation,
    )


def _compare_net_profit_margin(a: AnalyzeResponse, b: AnalyzeResponse) -> ComparisonMetric:
    """Compare net profit margins. Higher is better."""
    margin_a = a.ratios[0].net_profit_margin if a.ratios and a.ratios[0].net_profit_margin is not None else None
    margin_b = b.ratios[0].net_profit_margin if b.ratios and b.ratios[0].net_profit_margin is not None else None
    name_a = a.company.symbol
    name_b = b.company.symbol

    display_a = f"{margin_a:.2f}%" if margin_a is not None else "N/A"
    display_b = f"{margin_b:.2f}%" if margin_b is not None else "N/A"

    winner = "tie"
    explanation = "Net profit margin data is not available for both stocks."

    if margin_a is not None and margin_b is not None:
        if abs(margin_a - margin_b) < 1.0:
            winner = "tie"
            explanation = "Both stocks have similar profit margins."
        elif margin_a > margin_b:
            winner = "a"
            explanation = f"{name_a} keeps more of its revenue as profit."
        else:
            winner = "b"
            explanation = f"{name_b} keeps more of its revenue as profit."
    elif margin_a is not None:
        winner = "a"
        explanation = f"Margin data is only available for {name_a}."
    elif margin_b is not None:
        winner = "b"
        explanation = f"Margin data is only available for {name_b}."

    return ComparisonMetric(
        label="Net Profit Margin",
        description="Higher means company keeps more profit",
        value_a=margin_a,
        value_b=margin_b,
        display_a=display_a,
        display_b=display_b,
        winner=winner,
        explanation=explanation,
    )


def _compare_eps_growth(a: AnalyzeResponse, b: AnalyzeResponse) -> ComparisonMetric:
    """Compare EPS growth. Higher is better."""
    growth_a = a.ratios[0].eps_growth if a.ratios and a.ratios[0].eps_growth is not None else None
    growth_b = b.ratios[0].eps_growth if b.ratios and b.ratios[0].eps_growth is not None else None
    name_a = a.company.symbol
    name_b = b.company.symbol

    def _fmt_growth(val: float | None) -> str:
        if val is None:
            return "N/A"
        sign = "+" if val > 0 else ""
        return f"{sign}{val:.2f}%"

    display_a = _fmt_growth(growth_a)
    display_b = _fmt_growth(growth_b)

    winner = "tie"
    explanation = "EPS growth data is not available for both stocks."

    if growth_a is not None and growth_b is not None:
        if abs(growth_a - growth_b) < 1.0:
            winner = "tie"
            explanation = "Both stocks have similar EPS growth."
        elif growth_a > growth_b:
            winner = "a"
            if growth_b < 0 < growth_a:
                explanation = f"{name_a}'s per-share earnings are growing while {name_b}'s are shrinking."
            else:
                explanation = f"{name_a}'s per-share earnings are growing faster."
        else:
            winner = "b"
            if growth_a < 0 < growth_b:
                explanation = f"{name_b}'s per-share earnings are growing while {name_a}'s are shrinking."
            else:
                explanation = f"{name_b}'s per-share earnings are growing faster."
    elif growth_a is not None:
        winner = "a"
        explanation = f"EPS growth data is only available for {name_a}."
    elif growth_b is not None:
        winner = "b"
        explanation = f"EPS growth data is only available for {name_b}."

    return ComparisonMetric(
        label="EPS Growth",
        description="Higher means per-share profit is growing faster",
        value_a=growth_a,
        value_b=growth_b,
        display_a=display_a,
        display_b=display_b,
        winner=winner,
        explanation=explanation,
    )


def _compare_year_change(a: AnalyzeResponse, b: AnalyzeResponse) -> ComparisonMetric:
    """Compare 1-year price change. Higher is better."""
    change_a = a.price.year_change_percent
    change_b = b.price.year_change_percent
    name_a = a.company.symbol
    name_b = b.company.symbol

    def _fmt_change(val: float | None) -> str:
        if val is None:
            return "N/A"
        sign = "+" if val > 0 else ""
        return f"{sign}{val:.2f}%"

    display_a = _fmt_change(change_a)
    display_b = _fmt_change(change_b)

    winner = "tie"
    explanation = "1-year price change data is not available for both stocks."

    if change_a is not None and change_b is not None:
        if abs(change_a - change_b) < 1.0:
            winner = "tie"
            explanation = "Both stocks had similar price performance over the past year."
        elif change_a > change_b:
            winner = "a"
            explanation = f"{name_a} stock price grew more in the past year."
        else:
            winner = "b"
            explanation = f"{name_b} stock price grew more in the past year."
    elif change_a is not None:
        winner = "a"
        explanation = f"1-year change data is only available for {name_a}."
    elif change_b is not None:
        winner = "b"
        explanation = f"1-year change data is only available for {name_b}."

    return ComparisonMetric(
        label="1-Year Price Change",
        description="Higher means better stock price performance",
        value_a=change_a,
        value_b=change_b,
        display_a=display_a,
        display_b=display_b,
        winner=winner,
        explanation=explanation,
    )


def _compare_free_float(a: AnalyzeResponse, b: AnalyzeResponse) -> ComparisonMetric:
    """Compare free float percentage. Higher is better for liquidity."""
    ff_a = a.equity.free_float_percent
    ff_b = b.equity.free_float_percent
    name_a = a.company.symbol
    name_b = b.company.symbol

    display_a = f"{ff_a:.2f}%" if ff_a is not None else "N/A"
    display_b = f"{ff_b:.2f}%" if ff_b is not None else "N/A"

    winner = "tie"
    explanation = "Free float data is not available for both stocks."

    if ff_a is not None and ff_b is not None:
        if abs(ff_a - ff_b) < 2.0:
            winner = "tie"
            explanation = "Both stocks have similar free float levels."
        elif ff_a > ff_b:
            winner = "a"
            explanation = f"{name_a} is easier to trade due to higher free float."
        else:
            winner = "b"
            explanation = f"{name_b} is easier to trade due to higher free float."
    elif ff_a is not None:
        winner = "a"
        explanation = f"Free float data is only available for {name_a}."
    elif ff_b is not None:
        winner = "b"
        explanation = f"Free float data is only available for {name_b}."

    return ComparisonMetric(
        label="Free Float (Liquidity)",
        description="Higher means easier to buy and sell",
        value_a=ff_a,
        value_b=ff_b,
        display_a=display_a,
        display_b=display_b,
        winner=winner,
        explanation=explanation,
    )


_RISK_RANK = {"low": 1, "moderate": 2, "high": 3}


def _compare_risk(a: AnalyzeResponse, b: AnalyzeResponse) -> ComparisonMetric:
    """Compare risk levels. Lower risk is better."""
    risk_a = a.analysis.risk_level
    risk_b = b.analysis.risk_level
    name_a = a.company.symbol
    name_b = b.company.symbol

    display_a = risk_a.capitalize()
    display_b = risk_b.capitalize()

    rank_a = _RISK_RANK.get(risk_a, 2)
    rank_b = _RISK_RANK.get(risk_b, 2)

    if rank_a == rank_b:
        winner = "tie"
        explanation = "Both stocks carry a similar level of risk."
    elif rank_a < rank_b:
        winner = "a"
        explanation = f"{name_a} carries less overall risk."
    else:
        winner = "b"
        explanation = f"{name_b} carries less overall risk."

    return ComparisonMetric(
        label="Risk Level",
        description="Lower risk is generally better",
        value_a=risk_a,
        value_b=risk_b,
        display_a=display_a,
        display_b=display_b,
        winner=winner,
        explanation=explanation,
    )


_DIVIDEND_RANK = {"consistent": 3, "irregular": 2, "none": 1}


def _compare_dividends(a: AnalyzeResponse, b: AnalyzeResponse) -> ComparisonMetric:
    """Compare dividend status. Consistent is best."""
    div_a = a.analysis.dividend_status
    div_b = b.analysis.dividend_status
    name_a = a.company.symbol
    name_b = b.company.symbol

    display_a = div_a.capitalize()
    display_b = div_b.capitalize()

    rank_a = _DIVIDEND_RANK.get(div_a, 0)
    rank_b = _DIVIDEND_RANK.get(div_b, 0)

    if rank_a == rank_b:
        winner = "tie"
        if div_a == "none":
            explanation = "Neither stock pays dividends."
        else:
            explanation = "Both stocks have similar dividend track records."
    elif rank_a > rank_b:
        winner = "a"
        if div_b == "none":
            explanation = f"{name_a} pays dividends, {name_b} does not."
        else:
            explanation = f"{name_a} has a more reliable dividend history."
    else:
        winner = "b"
        if div_a == "none":
            explanation = f"{name_b} pays dividends, {name_a} does not."
        else:
            explanation = f"{name_b} has a more reliable dividend history."

    return ComparisonMetric(
        label="Dividend Status",
        description="Consistent dividends are better for income",
        value_a=div_a,
        value_b=div_b,
        display_a=display_a,
        display_b=display_b,
        winner=winner,
        explanation=explanation,
    )


def _generate_verdict(
    metrics: list[ComparisonMetric],
    score_a: int,
    score_b: int,
    name_a: str,
    name_b: str,
) -> str:
    """Generate a 2-3 sentence plain English verdict."""
    a_wins = [m.label for m in metrics if m.winner == "a"]
    b_wins = [m.label for m in metrics if m.winner == "b"]

    def _summarize_wins(wins: list[str]) -> str:
        if not wins:
            return ""
        if len(wins) == 1:
            return wins[0].lower()
        return ", ".join(w.lower() for w in wins[:-1]) + " and " + wins[-1].lower()

    if score_a > score_b:
        lead = f"{name_a} comes out ahead overall, winning {score_a} out of 7 metrics."
        if b_wins:
            detail = f"However, {name_b} is stronger in {_summarize_wins(b_wins)}."
        else:
            detail = f"{name_b} did not lead in any metric."
    elif score_b > score_a:
        lead = f"{name_b} comes out ahead overall, winning {score_b} out of 7 metrics."
        if a_wins:
            detail = f"However, {name_a} is stronger in {_summarize_wins(a_wins)}."
        else:
            detail = f"{name_a} did not lead in any metric."
    else:
        lead = f"Both stocks are evenly matched, each winning {score_a} metric(s)."
        detail = "The best choice depends on what matters most to you as an investor."

    return f"{lead} {detail}"


def compare_stocks(stock_a: AnalyzeResponse, stock_b: AnalyzeResponse) -> ComparisonResult:
    """Compare two analyzed stocks across 7 key metrics."""
    metrics = [
        _compare_pe(stock_a, stock_b),
        _compare_net_profit_margin(stock_a, stock_b),
        _compare_eps_growth(stock_a, stock_b),
        _compare_year_change(stock_a, stock_b),
        _compare_free_float(stock_a, stock_b),
        _compare_risk(stock_a, stock_b),
        _compare_dividends(stock_a, stock_b),
    ]

    score_a = sum(1 for m in metrics if m.winner == "a")
    score_b = sum(1 for m in metrics if m.winner == "b")

    verdict = _generate_verdict(
        metrics=metrics,
        score_a=score_a,
        score_b=score_b,
        name_a=stock_a.company.symbol,
        name_b=stock_b.company.symbol,
    )

    return ComparisonResult(
        metrics=metrics,
        score_a=score_a,
        score_b=score_b,
        verdict=verdict,
    )
