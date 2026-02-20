from pydantic import BaseModel, Field, field_validator
import re


# ── Request Models ──────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    url: str = Field(..., description="PSX company page URL", examples=["https://dps.psx.com.pk/company/ENGROH"])

    @field_validator("url")
    @classmethod
    def validate_psx_url(cls, v: str) -> str:
        pattern = r"^https://dps\.psx\.com\.pk/company/[A-Za-z0-9]+$"
        if not re.match(pattern, v.strip()):
            raise ValueError(
                "URL must match https://dps.psx.com.pk/company/{SYMBOL} "
                "where SYMBOL contains only letters and numbers."
            )
        return v.strip()


# ── Response Models ─────────────────────────────────────────────────────────

class CompanyInfo(BaseModel):
    name: str
    symbol: str
    sector: str
    description: str
    ceo: str | None = None
    chairman: str | None = None
    secretary: str | None = None
    website: str | None = None
    auditor: str | None = None
    fiscal_year_end: str | None = None


class PriceData(BaseModel):
    current: float | None = None
    change: float | None = None
    change_percent: float | None = None
    open: float | None = None
    high: float | None = None
    low: float | None = None
    volume: int | None = None
    day_range_low: float | None = None
    day_range_high: float | None = None
    week52_high: float | None = None
    week52_low: float | None = None
    ldcp: float | None = None
    pe_ratio: float | None = None
    year_change_percent: float | None = None
    ytd_change_percent: float | None = None
    circuit_breaker_low: float | None = None
    circuit_breaker_high: float | None = None


class IndexPoint(BaseModel):
    name: str = Field(..., description="Index name like KSE 100 or KSE 30")
    value: float | None = None
    change: float | None = None
    change_percent: float | None = None


class EquityData(BaseModel):
    market_cap_thousands: float | None = None
    total_shares: int | None = None
    free_float_shares: int | None = None
    free_float_percent: float | None = None


class FinancialYear(BaseModel):
    period: str = Field(..., description="Year like '2024' or quarter like 'Q3 2025'")
    sales: float | None = None
    total_income: float | None = None
    profit_after_tax: float | None = None
    eps: float | None = None


class RatioYear(BaseModel):
    year: str
    net_profit_margin: float | None = None
    eps_growth: float | None = None
    peg: float | None = None


class PayoutRecord(BaseModel):
    date: str | None = None
    financial_results: str | None = None
    details: str | None = None
    book_closure: str | None = None


class AnalysisResult(BaseModel):
    business_verdict: str = Field(..., description="strong | moderate | weak")
    financial_health: str = Field(..., description="healthy | stable | concerning")
    dividend_status: str = Field(..., description="consistent | irregular | none")
    valuation: str = Field(..., description="undervalued | fairly_valued | overvalued")
    risk_level: str = Field(..., description="low | moderate | high")
    summary_points: list[str] = Field(..., description="4-6 plain English summary points")


class AnalyzeResponse(BaseModel):
    company: CompanyInfo
    price: PriceData
    equity: EquityData
    financials_annual: list[FinancialYear]
    financials_quarterly: list[FinancialYear]
    ratios: list[RatioYear]
    payouts: list[PayoutRecord]
    analysis: AnalysisResult
    indices: list[IndexPoint] = Field(default_factory=list, description="Market index data (KSE 100, KSE 30, etc.)")


class StockListItem(BaseModel):
    symbol: str
    name: str


class StockListResponse(BaseModel):
    stocks: list[StockListItem]
    cached: bool = False


class HealthResponse(BaseModel):
    status: str = "healthy"


class ErrorResponse(BaseModel):
    detail: str


# ── Comparison Models ──────────────────────────────────────────────────────


class CompareRequest(BaseModel):
    url_a: str = Field(..., description="PSX company page URL for stock A", examples=["https://dps.psx.com.pk/company/ENGROH"])
    url_b: str = Field(..., description="PSX company page URL for stock B", examples=["https://dps.psx.com.pk/company/OGDC"])

    @field_validator("url_a", "url_b")
    @classmethod
    def validate_psx_url(cls, v: str) -> str:
        pattern = r"^https://dps\.psx\.com\.pk/company/[A-Za-z0-9]+$"
        if not re.match(pattern, v.strip()):
            raise ValueError(
                "URL must match https://dps.psx.com.pk/company/{SYMBOL} "
                "where SYMBOL contains only letters and numbers."
            )
        return v.strip()


class ComparisonMetric(BaseModel):
    label: str
    description: str
    value_a: float | str | None = None
    value_b: float | str | None = None
    display_a: str
    display_b: str
    winner: str  # "a", "b", or "tie"
    explanation: str


class ComparisonResult(BaseModel):
    metrics: list[ComparisonMetric]
    score_a: int  # number of metrics stock A wins
    score_b: int  # number of metrics stock B wins
    verdict: str  # overall plain English verdict


class CompareResponse(BaseModel):
    stock_a: AnalyzeResponse
    stock_b: AnalyzeResponse
    comparison: ComparisonResult
