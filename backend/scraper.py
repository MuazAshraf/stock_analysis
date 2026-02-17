"""
PSX Data Portal scraper.

Fetches and parses the company page at https://dps.psx.com.pk/company/{SYMBOL}.
All data lives on a single server-rendered HTML page.
"""

import logging
import re

import httpx
from bs4 import BeautifulSoup, Tag

from config import settings
from models import (
    CompanyInfo,
    EquityData,
    FinancialYear,
    IndexPoint,
    PayoutRecord,
    PriceData,
    RatioYear,
)

logger = logging.getLogger(__name__)


class ScraperError(Exception):
    """Raised when scraping fails for any reason."""


# ── Helpers ─────────────────────────────────────────────────────────────────


def _clean_number(text: str | None) -> str | None:
    """Strip commas, whitespace, icons, and parentheses from a numeric string.
    Parenthesised values like (4.74) become -4.74.
    """
    if text is None:
        return None
    text = text.strip()
    if not text or text == "--" or text == "-":
        return None
    # Handle parenthesised negatives: (4.74) -> -4.74
    paren = re.match(r"^\(([0-9,.\s]+)\)$", text)
    if paren:
        text = "-" + paren.group(1)
    # Remove commas and whitespace
    text = text.replace(",", "").replace(" ", "")
    # Remove percentage sign
    text = text.replace("%", "")
    return text if text else None


def _parse_float(text: str | None) -> float | None:
    cleaned = _clean_number(text)
    if cleaned is None:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


def _parse_int(text: str | None) -> int | None:
    cleaned = _clean_number(text)
    if cleaned is None:
        return None
    try:
        return int(float(cleaned))
    except ValueError:
        return None


def _get_stat_value(stats_container: Tag, label: str) -> str | None:
    """Find a stats_item by its label text and return the value text."""
    for item in stats_container.select(".stats_item"):
        lbl = item.select_one(".stats_label")
        val = item.select_one(".stats_value")
        if lbl and val and label.lower() in lbl.get_text(strip=True).lower():
            return val.get_text(strip=True)
    return None


# ── Main Scraper ────────────────────────────────────────────────────────────


async def fetch_page(url: str) -> str:
    """Fetch the raw HTML from a PSX company page."""
    async with httpx.AsyncClient(
        timeout=settings.request_timeout,
        follow_redirects=False,
        headers={"User-Agent": settings.user_agent},
    ) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.text


def _extract_symbol(url: str) -> str:
    """Extract the stock symbol from the URL path."""
    return url.rstrip("/").split("/")[-1].upper()


def _parse_quote(soup: BeautifulSoup) -> PriceData:
    """Parse the #quote section for price data."""
    quote_section = soup.select_one("#quote")
    if not quote_section:
        logger.warning("Quote section not found")
        return PriceData()

    # Current price from .quote__close
    price_el = quote_section.select_one(".quote__close")
    current_price = None
    if price_el:
        price_text = price_el.get_text(strip=True).replace("Rs.", "").replace("Rs", "")
        current_price = _parse_float(price_text)

    # Change and change percent from .quote__change
    change_el = quote_section.select_one(".quote__change")
    change_val = None
    change_pct = None
    if change_el:
        val_el = change_el.select_one(".change__value")
        pct_el = change_el.select_one(".change__percent")
        if val_el:
            change_val = _parse_float(val_el.get_text(strip=True))
        if pct_el:
            pct_text = pct_el.get_text(strip=True).strip("() ")
            change_pct = _parse_float(pct_text)

    # Stats from the REG tab (first tabs__panel)
    reg_panel = quote_section.select_one('.tabs__panel[data-name="REG"]')
    if not reg_panel:
        return PriceData(current=current_price, change=change_val, change_percent=change_pct)

    open_val = _parse_float(_get_stat_value(reg_panel, "Open"))
    high_val = _parse_float(_get_stat_value(reg_panel, "High"))
    low_val = _parse_float(_get_stat_value(reg_panel, "Low"))
    volume_val = _parse_int(_get_stat_value(reg_panel, "Volume"))
    ldcp_val = _parse_float(_get_stat_value(reg_panel, "LDCP"))
    pe_ratio = _parse_float(_get_stat_value(reg_panel, "P/E Ratio"))

    # 52-Week Range from .numRange data attributes
    week52_low = None
    week52_high = None
    for item in reg_panel.select(".stats_item"):
        lbl = item.select_one(".stats_label")
        if lbl and "52-WEEK" in lbl.get_text(strip=True).upper():
            nr = item.select_one(".numRange")
            if nr:
                week52_low = _parse_float(nr.get("data-low"))
                week52_high = _parse_float(nr.get("data-high"))
            break

    # Day Range
    day_range_low = None
    day_range_high = None
    for item in reg_panel.select(".stats_item"):
        lbl = item.select_one(".stats_label")
        if lbl and "DAY RANGE" in lbl.get_text(strip=True).upper():
            nr = item.select_one(".numRange")
            if nr:
                day_range_low = _parse_float(nr.get("data-low"))
                day_range_high = _parse_float(nr.get("data-high"))
            break

    # Circuit Breaker
    cb_low = None
    cb_high = None
    for item in reg_panel.select(".stats_item"):
        lbl = item.select_one(".stats_label")
        if lbl and "CIRCUIT BREAKER" in lbl.get_text(strip=True).upper():
            nr = item.select_one(".numRange")
            if nr:
                cb_low = _parse_float(nr.get("data-low"))
                cb_high = _parse_float(nr.get("data-high"))
            break

    # Year change and YTD change
    year_change = None
    ytd_change = None
    for item in reg_panel.select(".stats_item"):
        lbl = item.select_one(".stats_label")
        val = item.select_one(".stats_value")
        if not lbl or not val:
            continue
        label_text = lbl.get_text(strip=True).upper()
        val_text = val.get_text(strip=True).replace("%", "").strip()
        if "1-YEAR CHANGE" in label_text:
            year_change = _parse_float(val_text)
        elif "YTD CHANGE" in label_text:
            ytd_change = _parse_float(val_text)

    return PriceData(
        current=current_price,
        change=change_val,
        change_percent=change_pct,
        open=open_val,
        high=high_val,
        low=low_val,
        volume=volume_val,
        day_range_low=day_range_low,
        day_range_high=day_range_high,
        week52_high=week52_high,
        week52_low=week52_low,
        ldcp=ldcp_val,
        pe_ratio=pe_ratio,
        year_change_percent=year_change,
        ytd_change_percent=ytd_change,
        circuit_breaker_low=cb_low,
        circuit_breaker_high=cb_high,
    )


def _parse_profile(soup: BeautifulSoup, symbol: str) -> CompanyInfo:
    """Parse the #profile section for company info."""
    # Company name from .quote__name
    name_el = soup.select_one(".quote__name")
    name = name_el.get_text(strip=True) if name_el else symbol

    # Sector from .quote__sector
    sector_el = soup.select_one(".quote__sector")
    sector = sector_el.get_text(strip=True) if sector_el else "Unknown"

    profile_section = soup.select_one("#profile")
    description = ""
    ceo = None
    chairman = None
    secretary = None
    website = None
    auditor = None
    fiscal_year_end = None

    if profile_section:
        # Business description
        desc_el = profile_section.select_one(".profile__item--decription p")
        if desc_el:
            description = desc_el.get_text(strip=True)

        # Key people from the table
        people_table = profile_section.select_one(".profile__item--people .tbl")
        if people_table:
            for row in people_table.select("tr"):
                cells = row.select("td")
                if len(cells) >= 2:
                    person_name = cells[0].get_text(strip=True)
                    role = cells[1].get_text(strip=True).lower()
                    if "ceo" in role:
                        ceo = person_name
                    elif "chairman" in role:
                        chairman = person_name
                    elif "secretary" in role:
                        secretary = person_name

        # Other profile items
        for item in profile_section.select(".profile__item"):
            heads = item.select(".item__head")
            for head in heads:
                head_text = head.get_text(strip=True).upper()
                # Get the next sibling <p> element
                next_p = head.find_next_sibling("p")
                if not next_p:
                    continue
                if "WEBSITE" in head_text:
                    link = next_p.select_one("a")
                    website = link.get_text(strip=True) if link else next_p.get_text(strip=True)
                elif "AUDITOR" in head_text:
                    auditor = next_p.get_text(strip=True)
                elif "FISCAL YEAR" in head_text:
                    fiscal_year_end = next_p.get_text(strip=True)

    return CompanyInfo(
        name=name,
        symbol=symbol,
        sector=sector,
        description=description,
        ceo=ceo,
        chairman=chairman,
        secretary=secretary,
        website=website,
        auditor=auditor,
        fiscal_year_end=fiscal_year_end,
    )


def _parse_equity(soup: BeautifulSoup) -> EquityData:
    """Parse the #equity section."""
    equity_section = soup.select_one("#equity")
    if not equity_section:
        return EquityData()

    market_cap = None
    total_shares = None
    free_float_shares = None
    free_float_pct = None

    for item in equity_section.select(".stats_item"):
        lbl = item.select_one(".stats_label")
        val = item.select_one(".stats_value")
        if not lbl or not val:
            continue
        label_text = lbl.get_text(strip=True).upper()
        val_text = val.get_text(strip=True)

        if "MARKET CAP" in label_text:
            market_cap = _parse_float(val_text)
        elif "SHARES" in label_text and "FREE" not in label_text:
            total_shares = _parse_int(val_text)
        elif "FREE FLOAT" in label_text:
            if "%" in val_text:
                free_float_pct = _parse_float(val_text)
            else:
                free_float_shares = _parse_int(val_text)

    return EquityData(
        market_cap_thousands=market_cap,
        total_shares=total_shares,
        free_float_shares=free_float_shares,
        free_float_percent=free_float_pct,
    )


def _parse_financials_table(table: Tag) -> list[FinancialYear]:
    """Parse a financials table (annual or quarterly)."""
    results: list[FinancialYear] = []
    if not table:
        return results

    # Get column headers (periods)
    header_row = table.select_one("thead tr")
    if not header_row:
        return results
    headers = [th.get_text(strip=True) for th in header_row.select("th")]
    # First header is empty (row label column)
    periods = headers[1:]

    if not periods:
        return results

    # Initialize data dict for each period
    data: dict[str, dict[str, float | None]] = {p: {} for p in periods}

    # Parse rows
    for row in table.select("tbody tr"):
        cells = row.select("td")
        if len(cells) < 2:
            continue
        row_label = cells[0].get_text(strip=True).upper()
        for i, period in enumerate(periods):
            if i + 1 >= len(cells):
                break
            cell_text = cells[i + 1].get_text(strip=True)

            if "SALES" in row_label and "TOTAL" not in row_label:
                data[period]["sales"] = _parse_float(cell_text)
            elif "TOTAL INCOME" in row_label:
                data[period]["total_income"] = _parse_float(cell_text)
            elif "PROFIT AFTER" in row_label:
                data[period]["profit_after_tax"] = _parse_float(cell_text)
            elif row_label == "EPS":
                data[period]["eps"] = _parse_float(cell_text)

    for period in periods:
        d = data[period]
        results.append(
            FinancialYear(
                period=period,
                sales=d.get("sales"),
                total_income=d.get("total_income"),
                profit_after_tax=d.get("profit_after_tax"),
                eps=d.get("eps"),
            )
        )

    return results


def _parse_financials(soup: BeautifulSoup) -> tuple[list[FinancialYear], list[FinancialYear]]:
    """Parse the #financials section for both annual and quarterly data."""
    fin_section = soup.select_one("#financials")
    if not fin_section:
        return [], []

    annual: list[FinancialYear] = []
    quarterly: list[FinancialYear] = []

    panels = fin_section.select(".tabs__panel")
    for panel in panels:
        panel_name = panel.get("data-name", "")
        table = panel.select_one("table.tbl")
        if not table:
            continue
        if panel_name == "Annual":
            annual = _parse_financials_table(table)
        elif panel_name == "Quarterly":
            quarterly = _parse_financials_table(table)

    return annual, quarterly


def _parse_ratios(soup: BeautifulSoup) -> list[RatioYear]:
    """Parse the #ratios section."""
    ratios_section = soup.select_one("#ratios")
    if not ratios_section:
        return []

    table = ratios_section.select_one("table.tbl")
    if not table:
        return []

    # Get year headers
    header_row = table.select_one("thead tr")
    if not header_row:
        return []
    headers = [th.get_text(strip=True) for th in header_row.select("th")]
    years = headers[1:]

    if not years:
        return []

    data: dict[str, dict[str, float | None]] = {y: {} for y in years}

    for row in table.select("tbody tr"):
        cells = row.select("td")
        if len(cells) < 2:
            continue
        row_label = cells[0].get_text(strip=True).upper()
        for i, year in enumerate(years):
            if i + 1 >= len(cells):
                break
            cell_text = cells[i + 1].get_text(strip=True)

            if "NET PROFIT MARGIN" in row_label:
                data[year]["net_profit_margin"] = _parse_float(cell_text)
            elif "EPS GROWTH" in row_label:
                data[year]["eps_growth"] = _parse_float(cell_text)
            elif "PEG" in row_label:
                data[year]["peg"] = _parse_float(cell_text)

    results: list[RatioYear] = []
    for year in years:
        d = data[year]
        results.append(
            RatioYear(
                year=year,
                net_profit_margin=d.get("net_profit_margin"),
                eps_growth=d.get("eps_growth"),
                peg=d.get("peg"),
            )
        )

    return results


def _parse_payouts(soup: BeautifulSoup) -> list[PayoutRecord]:
    """Parse the #payouts section."""
    payouts_section = soup.select_one("#payouts")
    if not payouts_section:
        return []

    table = payouts_section.select_one("table.tbl")
    if not table:
        return []

    results: list[PayoutRecord] = []
    for row in table.select("tbody tr"):
        cells = row.select("td")
        if len(cells) < 2:
            continue
        record = PayoutRecord(
            date=cells[0].get_text(strip=True) if len(cells) > 0 else None,
            financial_results=cells[1].get_text(strip=True) if len(cells) > 1 else None,
            details=cells[2].get_text(strip=True) if len(cells) > 2 else None,
            book_closure=cells[3].get_text(strip=True) if len(cells) > 3 else None,
        )
        results.append(record)

    return results


def _parse_indices(soup: BeautifulSoup) -> list[IndexPoint]:
    """Parse market indices from the page header ticker."""
    indices: list[IndexPoint] = []
    ticker = soup.select_one(".ticker")
    if not ticker:
        return indices

    for item in ticker.select(".ticker__item"):
        name_el = item.select_one(".ticker__name")
        value_el = item.select_one(".ticker__value")
        change_el = item.select_one(".ticker__change")

        if not name_el or not value_el:
            continue

        name = name_el.get_text(strip=True)
        value = _parse_float(value_el.get_text(strip=True))

        change_val = None
        change_pct = None
        if change_el:
            change_text = change_el.get_text(strip=True)
            parts = re.match(r"([+-]?[\d,.]+)\s*\(([+-]?[\d,.]+)%?\)", change_text)
            if parts:
                change_val = _parse_float(parts.group(1))
                change_pct = _parse_float(parts.group(2))

        if name and value is not None:
            indices.append(IndexPoint(
                name=name,
                value=value,
                change=change_val,
                change_percent=change_pct,
            ))

    return indices


# ── Public API ──────────────────────────────────────────────────────────────


async def scrape_company(url: str) -> dict:
    """Scrape all data from a PSX company page.

    Returns a dict with keys matching AnalyzeResponse fields
    (minus the 'analysis' key, which is computed separately).
    """
    symbol = _extract_symbol(url)
    logger.info("Scraping PSX data for %s", symbol)

    try:
        html = await fetch_page(url)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise ScraperError(f"Company '{symbol}' not found on PSX.") from e
        raise ScraperError(
            f"PSX returned HTTP {e.response.status_code}. Please try again later."
        ) from e
    except httpx.TimeoutException as e:
        raise ScraperError(
            "PSX website is not responding. Please try again later."
        ) from e
    except httpx.RequestError as e:
        raise ScraperError(
            "Failed to connect to PSX. Please try again later."
        ) from e

    soup = BeautifulSoup(html, "html.parser")

    # Verify the page actually has content (not an error page)
    if not soup.select_one(".quote__name"):
        raise ScraperError(
            f"Could not find company data for '{symbol}'. "
            "The symbol may be invalid or the page structure may have changed."
        )

    company = _parse_profile(soup, symbol)
    price = _parse_quote(soup)
    equity = _parse_equity(soup)
    annual, quarterly = _parse_financials(soup)
    ratios = _parse_ratios(soup)
    payouts = _parse_payouts(soup)
    indices = _parse_indices(soup)

    return {
        "company": company,
        "price": price,
        "equity": equity,
        "financials_annual": annual,
        "financials_quarterly": quarterly,
        "ratios": ratios,
        "payouts": payouts,
        "indices": indices,
    }
