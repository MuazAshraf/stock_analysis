"""
PSX main site scraper — authoritative source for recent dividend/payout data.

The data portal at dps.psx.com.pk lags the corporate filing system by 1-2 months
for /payouts. The main PSX site at www.psx.com.pk/psx/announcement/financial-announcements
mirrors the live PUCAR feed and includes dividend %, EPS, profit, AGM date, and
book closure dates within minutes of the company filing them.

We pull the full page once every 30 minutes and serve all per-symbol queries
from an in-memory index. Falls back gracefully (returns empty) on any error.
"""

import asyncio
import logging
import re
import time
from datetime import datetime

import httpx
from bs4 import BeautifulSoup

from config import settings
from models import PayoutRecord

logger = logging.getLogger(__name__)


PSX_MAIN_URL = "https://www.psx.com.pk/psx/announcement/financial-announcements"
SYMBOLS_URL = "https://dps.psx.com.pk/symbols"

_CACHE_TTL = 1800  # 30 minutes
_NAME_MAP_TTL = 86_400  # 24 hours

_announcements_cache: dict[str, list[PayoutRecord]] = {}
_announcements_cache_time: float = 0.0
_announcements_lock = asyncio.Lock()

_name_to_symbol: dict[str, str] = {}
_name_map_time: float = 0.0
_name_map_lock = asyncio.Lock()


# ── Helpers ─────────────────────────────────────────────────────────────────


# Strip only the corporate-form suffixes — NOT distinguishing tokens like
# "holdings", "industries", "mills", "group". Removing those collapses real
# names: "Engro Corporation" and "Engro Holdings" become identical, which then
# routes the wrong stock's dividends.
_SUFFIX_RE = re.compile(
    r"\b(limited|ltd|company|co|corporation|corp|incorporated|inc|the)\b",
    re.IGNORECASE,
)
_PAREN_TAIL_RE = re.compile(r"\s*\([^)]*\)\s*$")
_PUNCT_RE = re.compile(r"[.,&'\"]+")
_WS_RE = re.compile(r"\s+")


def _normalize_name(name: str) -> str:
    """Lowercase + strip suffixes/punctuation/parentheticals so PSX main ('Systems Limited')
    matches /symbols ('Systems Ltd.', 'Systems Limited', etc.)."""
    if not name:
        return ""
    s = name.strip().lower()
    # Strip a trailing parenthetical like "(GEM)" or "(Defaulter)"
    s = _PAREN_TAIL_RE.sub("", s)
    s = _PUNCT_RE.sub(" ", s)
    s = _SUFFIX_RE.sub(" ", s)
    s = _WS_RE.sub(" ", s).strip()
    return s


_MONTH_TO_NUM = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}


def _format_date(date_header: str | None, time_str: str) -> str:
    """Combine a header like 'Apr 07, 2026' with a time like '15:57:13' into
    'April 7, 2026 3:57 PM' to match the format used by dps.psx.com.pk/payouts."""
    if not date_header:
        return time_str.strip()

    m = re.match(r"([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})", date_header.strip())
    if not m:
        return f"{date_header} {time_str}".strip()
    month_num = _MONTH_TO_NUM.get(m.group(1)[:3].lower())
    if not month_num:
        return f"{date_header} {time_str}".strip()
    day = int(m.group(2))
    year = int(m.group(3))

    hh = mm = 0
    tm = re.match(r"(\d{1,2}):(\d{2})", time_str.strip())
    if tm:
        hh = int(tm.group(1))
        mm = int(tm.group(2))

    try:
        dt = datetime(year, month_num, day, hh, mm)
    except ValueError:
        return f"{date_header} {time_str}".strip()
    month_name = dt.strftime("%B")
    hour12 = dt.hour % 12 or 12
    ampm = "AM" if dt.hour < 12 else "PM"
    return f"{month_name} {dt.day}, {dt.year} {hour12}:{dt.minute:02d} {ampm}"


def _is_payout_row(dividend_cell: str, book_closure_cell: str) -> bool:
    """Return True if this row represents a dividend/bonus/right (not a pure
    AGM/EOGM notice or a financial-result-only row)."""
    d = (dividend_cell or "").strip()
    if d in ("", "-"):
        return False
    # PSX dividend codes: (D)=cash, (B)=bonus, (R)=right
    return any(code in d.upper() for code in ("(D)", "(B)", "(R)"))


# ── Name → Symbol map ──────────────────────────────────────────────────────


async def _refresh_name_map() -> dict[str, str]:
    """Build the company-name → symbol mapping from the PSX symbols feed."""
    global _name_to_symbol, _name_map_time

    async with _name_map_lock:
        if _name_to_symbol and (time.time() - _name_map_time) < _NAME_MAP_TTL:
            return _name_to_symbol

        try:
            async with httpx.AsyncClient(
                timeout=settings.request_timeout,
                follow_redirects=False,
                headers={"User-Agent": settings.user_agent},
            ) as client:
                response = await client.get(SYMBOLS_URL)
                response.raise_for_status()
                data = response.json()
        except (httpx.HTTPError, ValueError) as e:
            logger.warning("Failed to refresh name→symbol map: %s", e)
            return _name_to_symbol  # serve stale rather than nothing

        new_map: dict[str, str] = {}
        for item in data:
            symbol = (item.get("symbol") or "").strip().upper()
            name = (item.get("name") or "").strip()
            if not symbol or not name:
                continue
            key = _normalize_name(name)
            if not key:
                continue
            # First entry wins on collision (equities are listed before debt/ETF in PSX feed).
            new_map.setdefault(key, symbol)

        if new_map:
            _name_to_symbol = new_map
            _name_map_time = time.time()
            logger.info("Built name→symbol map with %d entries", len(new_map))
        return _name_to_symbol


# ── Page Fetcher / Parser ──────────────────────────────────────────────────


async def _fetch_and_parse() -> dict[str, list[PayoutRecord]]:
    """Fetch the PSX main financial-announcements page and parse all dividend
    rows into PayoutRecord, indexed by symbol."""
    name_map = await _refresh_name_map()
    if not name_map:
        logger.warning("Name→symbol map is empty; cannot index PSX main payouts")
        return {}

    try:
        async with httpx.AsyncClient(
            timeout=settings.request_timeout,
            follow_redirects=True,
            headers={"User-Agent": settings.user_agent},
        ) as client:
            response = await client.get(PSX_MAIN_URL)
            response.raise_for_status()
            html = response.text
    except httpx.HTTPError as e:
        logger.warning("Failed to fetch PSX main announcements: %s", e)
        return {}

    soup = BeautifulSoup(html, "html.parser")
    table = soup.select_one("table")
    if not table:
        logger.warning("No table found on PSX main financial-announcements page")
        return {}

    # Lazy import to avoid a circular dependency with scraper.py
    from scraper import _humanize_dividend

    indexed: dict[str, list[PayoutRecord]] = {}
    current_date: str | None = None

    for row in table.select("tr"):
        # Date header row: <tr><th colspan="9"><h4>Apr 07, 2026</h4></th></tr>
        h4 = row.select_one("th h4")
        if h4:
            current_date = h4.get_text(strip=True)
            continue

        cells = row.select("td")
        if len(cells) < 9:
            continue

        company_name = cells[0].get_text(strip=True)
        time_str = cells[1].get_text(strip=True)
        fin_year = cells[2].get_text(strip=True)
        dividend_raw = cells[3].get_text(strip=True)
        agm_date = cells[7].get_text(strip=True)
        book_closure = cells[8].get_text(strip=True)

        if not _is_payout_row(dividend_raw, book_closure):
            continue

        symbol = name_map.get(_normalize_name(company_name))
        if not symbol:
            # Couldn't map this company name to a known symbol — skip silently.
            continue

        details = _humanize_dividend(dividend_raw)
        record = PayoutRecord(
            date=_format_date(current_date, time_str),
            financial_results=fin_year if fin_year not in ("", "-") else None,
            details=details,
            book_closure=book_closure.strip() if book_closure not in ("", "-") else None,
        )
        indexed.setdefault(symbol, []).append(record)

    logger.info(
        "Parsed %d dividend rows from PSX main across %d symbols",
        sum(len(v) for v in indexed.values()),
        len(indexed),
    )
    return indexed


# ── Public API ─────────────────────────────────────────────────────────────


async def fetch_recent_payouts(symbol: str) -> list[PayoutRecord]:
    """Return recent dividend records for the symbol from the PSX main page.

    Cached in memory for 30 minutes. Returns an empty list on any failure
    (the caller should fall back to the dps.psx.com.pk /payouts source).
    """
    global _announcements_cache, _announcements_cache_time

    async with _announcements_lock:
        is_stale = (time.time() - _announcements_cache_time) >= _CACHE_TTL
        if not _announcements_cache or is_stale:
            fresh = await _fetch_and_parse()
            if fresh:
                _announcements_cache = fresh
                _announcements_cache_time = time.time()

    return list(_announcements_cache.get(symbol.upper(), []))
