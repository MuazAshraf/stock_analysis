"""
Fetch structured financial statements from Yahoo Finance for PSX stocks.

PSX stocks use the .KA suffix on Yahoo Finance (e.g., PPL.KA, OGDC.KA).
"""

import logging
import math
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass

from models import (
    BalanceSheetPeriod,
    CashFlowPeriod,
    FinancialStatements,
    IncomeStatementPeriod,
    PricePoint,
)

logger = logging.getLogger(__name__)

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


_OPERATING_CF_KEYS = [
    "Operating Cash Flow",
    "Cash Flowsfromusedin Operating Activities Direct",
]


def _parse_cashflow(df) -> list[CashFlowPeriod]:
    if df is None or df.empty:
        return []
    results = []
    for col in df.columns:
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


# ── Combined Yahoo Finance data ───────────────────────────────────────────


@dataclass
class YahooData:
    statements: FinancialStatements | None
    price_history: list[PricePoint]
    book_value: float | None


def _fetch_all_yahoo_data_sync(symbol: str) -> YahooData:
    """Fetch all Yahoo Finance data using a SINGLE ticker object to avoid rate limits."""
    import time
    import yfinance as yf

    statements = None
    price_history: list[PricePoint] = []
    book_value = None

    for attempt in range(3):
        try:
            ticker = yf.Ticker(f"{symbol}.KA")

            # 1. Book value + info (lightest call first)
            if book_value is None:
                try:
                    info = ticker.info or {}
                    book_value = _safe(info.get("bookValue"))
                except Exception:
                    logger.warning("Failed to fetch book value for %s (attempt %d)", symbol, attempt + 1)

            # 2. Price history
            if not price_history:
                try:
                    df = ticker.history(period="1y", interval="1wk")
                    if df is not None and not df.empty:
                        for date, row in df.iterrows():
                            close = _safe(row.get("Close"))
                            if close is not None:
                                price_history.append(PricePoint(
                                    date=date.strftime("%Y-%m-%d"),
                                    close=close,
                                ))
                except Exception:
                    logger.warning("Failed to fetch price history for %s (attempt %d)", symbol, attempt + 1)

            # 3. Financial statements (heaviest call last)
            if statements is None:
                try:
                    stmts = FinancialStatements(
                        income_annual=_parse_income(ticker.income_stmt),
                        income_quarterly=_parse_income(ticker.quarterly_income_stmt),
                        balance_annual=_parse_balance(ticker.balance_sheet),
                        balance_quarterly=_parse_balance(ticker.quarterly_balance_sheet),
                        cashflow_annual=_parse_cashflow(ticker.cashflow),
                        cashflow_quarterly=_parse_cashflow(ticker.quarterly_cashflow),
                    )
                    has_data = (
                        len(stmts.income_annual) > 0
                        or len(stmts.balance_annual) > 0
                        or len(stmts.cashflow_annual) > 0
                    )
                    if has_data:
                        statements = stmts
                except Exception:
                    logger.warning("Failed to fetch statements for %s (attempt %d)", symbol, attempt + 1)

            # If we got everything, stop retrying
            if statements and price_history and book_value is not None:
                break

        except Exception:
            logger.warning("Yahoo Finance attempt %d failed for %s", attempt + 1, symbol)

        # Wait before retry (2s, 4s)
        if attempt < 2:
            time.sleep(2 * (attempt + 1))

    return YahooData(
        statements=statements,
        price_history=price_history,
        book_value=book_value,
    )


async def fetch_all_yahoo_data(symbol: str) -> YahooData:
    """Fetch all Yahoo Finance data for a PSX stock in one call."""
    import asyncio

    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(_executor, _fetch_all_yahoo_data_sync, symbol)
        logger.info(
            "Yahoo data for %s: statements=%s, prices=%d, book_value=%s",
            symbol,
            result.statements is not None,
            len(result.price_history),
            result.book_value,
        )
        return result
    except Exception:
        logger.exception("Failed to fetch Yahoo Finance data for %s", symbol)
        return YahooData(statements=None, price_history=[], book_value=None)
