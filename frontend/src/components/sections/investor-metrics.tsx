"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import type { InvestorMetrics } from "@/types/stock";

interface Props {
  metrics: InvestorMetrics | null | undefined;
}

function formatPct(value: number | null | undefined): string {
  if (value == null || !isFinite(value)) return "N/A";
  return `${value.toFixed(1)}%`;
}

// Reading guides — not buy/sell calls, just interpretation hints.
function dividendYieldBucket(y: number | null | undefined) {
  if (y == null) return null;
  if (y < 2)
    return {
      label: "Low",
      color: "#d97706",
      hint: "Dividend yield is below 2%. Most of the return — if any — will need to come from share-price appreciation.",
    };
  if (y < 6)
    return {
      label: "Healthy",
      color: "#4BC232",
      hint: "A typical, healthy yield for a Pakistani dividend payer. The cash income covers a meaningful slice of your return.",
    };
  if (y < 12)
    return {
      label: "High Yield",
      color: "#16a34a",
      hint: "Above-average yield — attractive for income investors. Verify the dividend is sustainable from current earnings.",
    };
  return {
    label: "Very High",
    color: "#ef4444",
    hint: "Yield is unusually high — sometimes a sign the share price has dropped or the dividend is not sustainable. Worth checking why.",
  };
}

function payoutBucket(p: number | null | undefined) {
  if (p == null) return null;
  if (p < 30)
    return {
      label: "Reinvesting",
      color: "#2B5288",
      hint: "The company keeps most of its earnings to grow the business — typical for younger or fast-growing firms.",
    };
  if (p <= 70)
    return {
      label: "Balanced",
      color: "#4BC232",
      hint: "A balanced split: some profit returned as dividends, some kept for growth.",
    };
  return {
    label: "High Payout",
    color: "#d97706",
    hint: "Most earnings are paid out as dividends. Common in mature companies, but leaves less room to absorb a bad year.",
  };
}

function roeBucket(r: number | null | undefined) {
  if (r == null) return null;
  if (r < 10)
    return {
      label: "Below Average",
      color: "#ef4444",
      hint: "Returning under 10% on shareholders' money. Below the typical PSX benchmark.",
    };
  if (r < 20)
    return {
      label: "Solid",
      color: "#4BC232",
      hint: "A healthy return on shareholders' equity — the company is using its capital productively.",
    };
  return {
    label: "Excellent",
    color: "#16a34a",
    hint: "Very high return on equity. Company turns each rupee of shareholder capital into strong profit.",
  };
}

function cagrBucket(c: number | null | undefined) {
  if (c == null) return null;
  if (c < 0)
    return {
      label: "Declining",
      color: "#ef4444",
      hint: "The share price has trended down over this window — capital appreciation has been negative.",
    };
  if (c < 10)
    return {
      label: "Modest",
      color: "#d97706",
      hint: "Below-inflation or low single-digit annual growth. Dividends may make up the rest of the return.",
    };
  if (c < 25)
    return {
      label: "Strong",
      color: "#4BC232",
      hint: "Healthy compound annual growth — the share price has rewarded long-term holders.",
    };
  return {
    label: "Exceptional",
    color: "#16a34a",
    hint: "Very high annualised price growth. Re-check fundamentals to see whether it's sustainable.",
  };
}

export function InvestorMetricsSection({ metrics }: Props) {
  if (!metrics) return null;

  const {
    dividend_yield_pct,
    payout_ratio_pct,
    roe_pct,
    price_cagr_pct,
    price_cagr_years,
  } = metrics;
  const dy = dividendYieldBucket(dividend_yield_pct);
  const payout = payoutBucket(payout_ratio_pct);
  const roe = roeBucket(roe_pct);
  const cagr = cagrBucket(price_cagr_pct);
  const cagrYearsLabel = price_cagr_years
    ? `${price_cagr_years}-Year Price CAGR`
    : "Price CAGR";

  return (
    <Card className="border-brand-border bg-brand-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-brand-fg flex items-center gap-2">
          Investor Parameters
          <Badge className="bg-brand-bg text-brand-fg text-xs font-normal">
            Buy-Decision Helpers
          </Badge>
        </CardTitle>
        <p className="text-sm text-brand-fg/60">
          Quick parameters that help you judge whether a stock is rewarding shareholders and using their capital efficiently.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dividend Yield */}
        <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
          <MetricExplainer
            label="Dividend Yield"
            explanation="Annual cash dividends per share, divided by current stock price. The cash return you'd get just from holding the stock — no selling required. Calculated using the actual face value (so it's correct even for stocks like SYS that trade with a Rs. 2 par value)."
          />
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-brand-fg">
              {formatPct(dividend_yield_pct)}
            </span>
            {dy && (
              <Badge
                className="text-white text-xs"
                style={{ backgroundColor: dy.color }}
              >
                {dy.label}
              </Badge>
            )}
          </div>
          <p className="text-xs text-brand-fg/70 mt-2 leading-relaxed">
            {dy?.hint ??
              "No cash dividend in the last 12 months — or no current price available."}
          </p>
          <p className="text-[10px] text-brand-fg/40 mt-2 font-mono">
            DPS ÷ Price × 100
          </p>
        </div>

        {/* Payout Ratio */}
        <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
          <MetricExplainer
            label="Payout Ratio"
            explanation="What % of the company's per-share earnings is paid out as cash dividends. Low = company is reinvesting profits to grow. High = mature company returning most profits to shareholders."
          />
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-brand-fg">
              {formatPct(payout_ratio_pct)}
            </span>
            {payout && (
              <Badge
                className="text-white text-xs"
                style={{ backgroundColor: payout.color }}
              >
                {payout.label}
              </Badge>
            )}
          </div>
          <p className="text-xs text-brand-fg/70 mt-2 leading-relaxed">
            {payout?.hint ??
              "Not enough data — needs a recent cash dividend and positive EPS."}
          </p>
          <p className="text-[10px] text-brand-fg/40 mt-2 font-mono">
            DPS ÷ EPS × 100
          </p>
        </div>

        {/* ROE */}
        <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
          <MetricExplainer
            label="ROE — Return on Equity"
            explanation="How much profit the company generates from each rupee of shareholders' money. Higher ROE means the company is more efficient at turning your capital into earnings."
          />
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-brand-fg">
              {formatPct(roe_pct)}
            </span>
            {roe && (
              <Badge
                className="text-white text-xs"
                style={{ backgroundColor: roe.color }}
              >
                {roe.label}
              </Badge>
            )}
            {roe == null && roe_pct == null && (
              <Badge variant="outline" className="text-xs">
                <Info className="h-3 w-3 mr-1" /> Needs book value
              </Badge>
            )}
          </div>
          <p className="text-xs text-brand-fg/70 mt-2 leading-relaxed">
            {roe?.hint ??
              "ROE needs the company's book value per share. We display this once that data is available for the stock."}
          </p>
          <p className="text-[10px] text-brand-fg/40 mt-2 font-mono">
            EPS ÷ BVPS × 100
          </p>
        </div>

        {/* Price CAGR */}
        <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
          <MetricExplainer
            label={cagrYearsLabel}
            explanation="Compound Annual Growth Rate of the share price over the last several years. Smooths out daily noise into a single 'how much per year on average' number. Doesn't include dividends — only the price."
          />
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-brand-fg">
              {formatPct(price_cagr_pct)}
              {price_cagr_pct != null && price_cagr_pct >= 0 ? (
                <TrendingUp className="inline h-5 w-5 ml-1 text-[#4BC232]" />
              ) : price_cagr_pct != null && price_cagr_pct < 0 ? (
                <TrendingDown className="inline h-5 w-5 ml-1 text-red-500" />
              ) : null}
            </span>
            {cagr && (
              <Badge
                className="text-white text-xs"
                style={{ backgroundColor: cagr.color }}
              >
                {cagr.label}
              </Badge>
            )}
          </div>
          <p className="text-xs text-brand-fg/70 mt-2 leading-relaxed">
            {cagr?.hint ??
              "Need at least one full year of price history to compute. Newly listed stocks may not have enough data yet."}
          </p>
          <p className="text-[10px] text-brand-fg/40 mt-2 font-mono">
            (Latest ÷ Earliest) ^ (1 ÷ years) − 1
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
