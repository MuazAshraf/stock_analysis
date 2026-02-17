# PSX Stock Analyzer

A dashboard for non-finance Pakistani investors to analyze and compare stocks listed on the Pakistan Stock Exchange (PSX). Users paste a PSX URL and get a jargon-free analysis in plain English.

## Project Structure

```
stock-analysis/
├── backend/          # FastAPI (Python 3.12+)
│   ├── main.py       # App entry, routes: /api/health, /api/analyze, /api/compare
│   ├── scraper.py    # Async httpx + BeautifulSoup scraper for dps.psx.com.pk
│   ├── analyzer.py   # Rule-based stock analysis (verdicts, risk, valuation)
│   ├── comparator.py # Side-by-side comparison of two stocks (7 metrics)
│   ├── models.py     # Pydantic v2 request/response schemas
│   └── config.py     # Settings via pydantic-settings (env prefix: PSX_)
├── frontend/         # Next.js 16 + TypeScript + Tailwind v4
│   └── src/
│       ├── app/          # App Router (single page)
│       ├── components/   # UI components
│       │   ├── sections/ # Feature sections (9 total)
│       │   ├── ui/       # shadcn/ui primitives
│       │   ├── dashboard.tsx           # Main page with Analyze/Compare tabs
│       │   ├── search-bar.tsx          # Single stock URL input
│       │   ├── compare-search.tsx      # Two stock URL inputs
│       │   ├── loading-skeleton.tsx    # Analyze loading state
│       │   └── comparison-loading-skeleton.tsx
│       ├── lib/
│       │   ├── api.ts    # API client (analyzeStock, compareStocks)
│       │   └── format.ts # PKR formatting helpers
│       └── types/
│           └── stock.ts  # TypeScript interfaces matching backend models
└── Idea.md
```

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py          # runs on http://127.0.0.1:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # runs on http://localhost:3000
```

Frontend reads `NEXT_PUBLIC_API_URL` from `.env.local` (defaults to `http://localhost:8000`).

## Build & Lint

```bash
# Frontend type check + build
cd frontend && npm run build

# Backend has no test suite yet; manual testing via /api/analyze and /api/compare
```

## Key Conventions

- **Backend fields use snake_case** (e.g., `financials_annual`, `profit_after_tax`, `change_percent`). Frontend TypeScript interfaces mirror this exactly.
- **All numeric fields are nullable** (`float | None` in Python, `number | null` in TypeScript). Always use `?? 0` or `!= null` guards in frontend code.
- **Financial data uses `period` field** (not `year`) in both backend `FinancialYear` and frontend `FinancialYear` type.
- **PSX URL format**: `https://dps.psx.com.pk/company/{SYMBOL}` — validated with regex on both frontend and backend.
- **Color palette**: green `#4BC232`, dark `#404E3F`, beige `#F8F3EA`, border `#E5E0D9`.
- **No AI/LLM calls** — all analysis is rule-based in `analyzer.py` and `comparator.py`.
- **SSRF protection**: scraper uses `follow_redirects=False`.
- **Rate limiting**: `10/minute` via slowapi.

## API Endpoints

| Method | Path           | Body                        | Returns          |
|--------|----------------|-----------------------------|------------------|
| GET    | /api/health    | —                           | `{ status }`     |
| POST   | /api/analyze   | `{ url }`                   | `AnalyzeResponse`|
| POST   | /api/compare   | `{ url_a, url_b }`          | `CompareResponse`|

## Frontend Sections (in render order)

1. **MarketTicker** — KSE 100, KSE 30 index points
2. **CompanyOverview** — Name, sector, price, 52-week range
3. **TradingInfo** — LDCP, buyer/seller strength, circuit breaker
4. **MoneyTalk** — Revenue/profit bar charts (Recharts)
5. **HealthCheck** — P/E gauge, profit margin, EPS growth
6. **DividendCheck** — Dividend history table
7. **FinalVerdict** — Business verdict, risk meter, summary points
8. **Formulas** — Educational formulas (Book Value, Dividend Yield, etc.)
9. **ComparisonView** — Side-by-side scoreboard + 7 metric cards (compare tab only)
