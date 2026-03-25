"""
PSX Stock Analyzer - FastAPI Backend

Provides an API to scrape and analyze stocks listed on the Pakistan Stock Exchange.
"""

import asyncio
import logging
import signal
import time

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from analyzer import analyze
from comparator import compare_stocks
from config import settings
from models import (
    AnalyzeRequest,
    AnalyzeResponse,
    CompareRequest,
    CompareResponse,
    ErrorResponse,
    HealthResponse,
    StockListResponse,
)
from scraper import ScraperError, fetch_all_stocks, scrape_company, scrape_stock_list
from yfinance_scraper import fetch_all_yahoo_data

# ── Logging (structured, no PII) ──────────────────────────────────────────

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ── Rate Limiter ────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address)

# ── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.app_name,
    description="Scrapes and analyzes PSX-listed stocks for simple, human-readable insights.",
    version="1.0.0",
    docs_url=None if not settings.debug else "/docs",
    redoc_url=None if not settings.debug else "/redoc",
    openapi_url=None if not settings.debug else "/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Security Middleware ────────────────────────────────────────────────────

# Trusted hosts — block requests with spoofed Host headers
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "api.psxstocksanalyzer.com",
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "*.railway.internal",
    ],
)

# CORS — strict whitelist, only allowed methods
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


# ── Security Headers ──────────────────────────────────────────────────────

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    # Block oversized request bodies (max 10KB — our payloads are tiny)
    if request.method == "POST":
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > 10_240:
            return JSONResponse(status_code=413, content={"detail": "Request too large"})

    response = await call_next(request)

    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cache-Control"] = "no-store" if request.url.path.startswith("/api/analyze") else "public, max-age=300"
    return response


# ── Graceful Shutdown ─────────────────────────────────────────────────────

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down gracefully...")


def _handle_sigterm(*args):
    raise SystemExit(0)


signal.signal(signal.SIGTERM, _handle_sigterm)

# ── Stock List Cache (per index) ───────────────────────────────────────────

_stock_list_cache: dict[str, StockListResponse] = {}
_stock_list_cache_time: dict[str, float] = {}
_STOCK_LIST_TTL = 3600  # 1 hour
_VALID_INDICES = {"KSE100", "KSE30", "ALL"}

# ── Shariah Compliance Cache ───────────────────────────────────────────────

_shariah_symbols: set[str] = set()
_shariah_cache_time: float = 0.0
_SHARIAH_TTL = 86400  # 24 hours (list changes quarterly)


async def _get_shariah_symbols() -> set[str]:
    """Return the cached set of Shariah-compliant symbols (KMIALLSHR index)."""
    global _shariah_symbols, _shariah_cache_time

    if _shariah_symbols and (time.time() - _shariah_cache_time) < _SHARIAH_TTL:
        return _shariah_symbols

    try:
        stocks = await scrape_stock_list("KMIALLSHR")
        _shariah_symbols = {s.symbol for s in stocks}
        _shariah_cache_time = time.time()
        logger.info("Loaded %d Shariah-compliant symbols", len(_shariah_symbols))
    except ScraperError:
        logger.warning("Failed to fetch Shariah list, using stale cache")

    return _shariah_symbols


# ── Routes ──────────────────────────────────────────────────────────────────


@app.get("/api/stocks", response_model=StockListResponse)
@limiter.limit("30/minute")
async def list_stocks(
    request: Request,
    index: str = Query("KSE100", description="PSX index: KSE100, KSE30, or ALL"),
):
    """Return the stock list for a specific PSX index, or all equities."""
    index = index.upper()
    if index not in _VALID_INDICES:
        return JSONResponse(
            status_code=400,
            content={"detail": f"Invalid index. Must be one of: {', '.join(sorted(_VALID_INDICES))}"},
        )

    # Check cache
    if index in _stock_list_cache and (time.time() - _stock_list_cache_time.get(index, 0)) < _STOCK_LIST_TTL:
        return StockListResponse(stocks=_stock_list_cache[index].stocks, cached=True)

    try:
        if index == "ALL":
            stocks = await fetch_all_stocks()
        else:
            stocks = await scrape_stock_list(index)
    except ScraperError as e:
        return JSONResponse(status_code=502, content={"detail": str(e)})

    stocks.sort(key=lambda s: s.symbol)

    response = StockListResponse(stocks=stocks)
    _stock_list_cache[index] = response
    _stock_list_cache_time[index] = time.time()

    return response


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse()


@app.post(
    "/api/analyze",
    response_model=AnalyzeResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid URL"},
        404: {"model": ErrorResponse, "description": "Company not found"},
        502: {"model": ErrorResponse, "description": "PSX unreachable"},
        429: {"description": "Rate limit exceeded"},
    },
)
@limiter.limit(settings.rate_limit)
async def analyze_company(request: Request, body: AnalyzeRequest):
    """Scrape a PSX company page and return structured analysis."""
    logger.info("Analyzing: %s", body.url)

    try:
        scraped = await scrape_company(body.url)
    except ScraperError as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            return JSONResponse(status_code=404, content={"detail": error_msg})
        return JSONResponse(status_code=502, content={"detail": error_msg})
    except Exception:
        logger.exception("Unexpected error analyzing %s", body.url)
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal error occurred. Please try again."},
        )

    analysis = analyze(
        company=scraped["company"],
        price=scraped["price"],
        equity=scraped["equity"],
        financials_annual=scraped["financials_annual"],
        ratios=scraped["ratios"],
        payouts=scraped["payouts"],
    )

    shariah_set = await _get_shariah_symbols()
    symbol = scraped["company"].symbol.upper()

    # Fetch all Yahoo Finance data in one call (avoids rate limiting)
    yahoo = await fetch_all_yahoo_data(symbol)

    return AnalyzeResponse(
        company=scraped["company"],
        price=scraped["price"],
        equity=scraped["equity"],
        financials_annual=scraped["financials_annual"],
        financials_quarterly=scraped["financials_quarterly"],
        ratios=scraped["ratios"],
        payouts=scraped["payouts"],
        analysis=analysis,
        indices=scraped.get("indices", []),
        is_shariah=symbol in shariah_set,
        statements=yahoo.statements,
        price_history=yahoo.price_history,
        book_value=yahoo.book_value,
    )


@app.post(
    "/api/compare",
    response_model=CompareResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid URL"},
        404: {"model": ErrorResponse, "description": "Company not found"},
        502: {"model": ErrorResponse, "description": "PSX unreachable"},
        429: {"description": "Rate limit exceeded"},
    },
)
@limiter.limit(settings.rate_limit)
async def compare_companies(request: Request, body: CompareRequest):
    """Scrape two PSX companies and return a side-by-side comparison."""
    logger.info("Comparing: %s vs %s", body.url_a, body.url_b)

    # Scrape both stocks concurrently
    try:
        scraped_a, scraped_b = await asyncio.gather(
            scrape_company(body.url_a),
            scrape_company(body.url_b),
        )
    except ScraperError as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            return JSONResponse(status_code=404, content={"detail": error_msg})
        return JSONResponse(status_code=502, content={"detail": error_msg})
    except Exception:
        logger.exception("Unexpected error comparing %s vs %s", body.url_a, body.url_b)
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal error occurred. Please try again."},
        )

    shariah_set = await _get_shariah_symbols()

    # Analyze each stock individually
    def _build_response(scraped: dict) -> AnalyzeResponse:
        analysis = analyze(
            company=scraped["company"],
            price=scraped["price"],
            equity=scraped["equity"],
            financials_annual=scraped["financials_annual"],
            ratios=scraped["ratios"],
            payouts=scraped["payouts"],
        )
        symbol = scraped["company"].symbol.upper()
        return AnalyzeResponse(
            company=scraped["company"],
            price=scraped["price"],
            equity=scraped["equity"],
            financials_annual=scraped["financials_annual"],
            financials_quarterly=scraped["financials_quarterly"],
            ratios=scraped["ratios"],
            payouts=scraped["payouts"],
            analysis=analysis,
            indices=scraped.get("indices", []),
            is_shariah=symbol in shariah_set,
        )

    stock_a = _build_response(scraped_a)
    stock_b = _build_response(scraped_b)

    comparison = compare_stocks(stock_a, stock_b)

    return CompareResponse(
        stock_a=stock_a,
        stock_b=stock_b,
        comparison=comparison,
    )


# ── Startup ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    import os

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=port == 8000)
