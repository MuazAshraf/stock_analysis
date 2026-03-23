"""
Fetch structured financial statements from Yahoo Finance for PSX stocks.

PSX stocks use the .KA suffix on Yahoo Finance (e.g., PPL.KA, OGDC.KA).
"""

import logging
import math
from concurrent.futures import ThreadPoolExecutor

from models import (
    BalanceSheetPeriod,
    CashFlowPeriod,
    FinancialStatements,
    IncomeStatementPeriod,
)

logger = logging.getLogger(__name__)

# yfinance is synchronous; we run it in a thread pool
_executor = ThreadPoolExecutor(max_workers=2)


def _safe(val) -> float | None:
    """Convert a pandas/numpy value to a Python float, or None."""
    if val is None:
        return None
    try:
        f = float(val)
        return None if (math.isnan(f) or math.isinf(f)) else f
    except (TypeError, ValueError):
        return None


def _get_val(df, row_name, col):
    """Safely get a value from a DataFrame by row label and column."""
    if row_name not in df.index:
        return None
    return _safe(df.at[row_name, col])


def _format_period(ts) -> str:
    """Convert a pandas Timestamp to a readable period string."""
    return ts.strftime("%b %Y")


def _parse_income(df) -> list[IncomeStatementPeriod]:
    if df is None or df.empty:
        return []
    results = []
    for col in df.columns:
        results.append(IncomeStatementPeriod(
            period=_format_period(col),
            revenue=_get_val(df, "Total Revenue", col),
            gross_profit=_get_val(df, "Gross Profit", col),
            operating_income=_get_val(df, "Operating Income", col),
            pretax_income=_get_val(df, "Pretax Income", col),
            tax=_get_val(df, "Tax Provision", col),
            net_income=_get_val(df, "Net Income", col),
            eps=_get_val(df, "Basic EPS", col) or _get_val(df, "Diluted EPS", col),
        ))
    return results


def _parse_balance(df) -> list[BalanceSheetPeriod]:
    if df is None or df.empty:
        return []
    results = []
    for col in df.columns:
        results.append(BalanceSheetPeriod(
            period=_format_period(col),
            total_assets=_get_val(df, "Total Assets", col),
            total_equity=_get_val(df, "Stockholders Equity", col),
            total_liabilities=_get_val(df, "Total Liabilities Net Minority Interest", col),
            total_debt=_get_val(df, "Total Debt", col),
            cash=_get_val(df, "Cash And Cash Equivalents", col),
            current_assets=_get_val(df, "Current Assets", col),
            current_liabilities=_get_val(df, "Current Liabilities", col),
        ))
    return results


# PSX companies often use direct-method cash flow, so the field name differs.
_OPERATING_CF_KEYS = [
    "Operating Cash Flow",
    "Cash Flowsfromusedin Operating Activities Direct",
]


def _parse_cashflow(df) -> list[CashFlowPeriod]:
    if df is None or df.empty:
        return []
    results = []
    for col in df.columns:
        # Find operating cash flow (differs between direct/indirect method)
        ocf = None
        for key in _OPERATING_CF_KEYS:
            ocf = _get_val(df, key, col)
            if ocf is not None:
                break

        results.append(CashFlowPeriod(
            period=_format_period(col),
            operating_cash_flow=ocf,
            investing_cash_flow=_get_val(df, "Investing Cash Flow", col),
            financing_cash_flow=_get_val(df, "Financing Cash Flow", col),
            free_cash_flow=_get_val(df, "Free Cash Flow", col),
            capital_expenditure=_get_val(df, "Capital Expenditure", col),
            end_cash=_get_val(df, "End Cash Position", col),
        ))
    return results


def _fetch_statements_sync(symbol: str) -> FinancialStatements:
    """Synchronous function that fetches all statements from Yahoo Finance."""
    import yfinance as yf

    ticker = yf.Ticker(f"{symbol}.KA")

    return FinancialStatements(
        income_annual=_parse_income(ticker.income_stmt),
        income_quarterly=_parse_income(ticker.quarterly_income_stmt),
        balance_annual=_parse_balance(ticker.balance_sheet),
        balance_quarterly=_parse_balance(ticker.quarterly_balance_sheet),
        cashflow_annual=_parse_cashflow(ticker.cashflow),
        cashflow_quarterly=_parse_cashflow(ticker.quarterly_cashflow),
    )


async def fetch_financial_statements(symbol: str) -> FinancialStatements | None:
    """Fetch financial statements for a PSX stock via Yahoo Finance.

    Returns None if data is unavailable or the request fails.
    """
    import asyncio

    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(_executor, _fetch_statements_sync, symbol)

        # Check if we got any meaningful data
        has_data = (
            len(result.income_annual) > 0
            or len(result.balance_annual) > 0
            or len(result.cashflow_annual) > 0
        )
        if not has_data:
            logger.warning("No financial statements found on Yahoo Finance for %s", symbol)
            return None

        logger.info(
            "Fetched statements for %s: %d annual income, %d annual balance, %d annual cashflow",
            symbol,
            len(result.income_annual),
            len(result.balance_annual),
            len(result.cashflow_annual),
        )
        return result

    except Exception:
        logger.exception("Failed to fetch Yahoo Finance data for %s", symbol)
        return None
