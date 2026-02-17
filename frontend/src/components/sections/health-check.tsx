"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Price, RatioYear } from "@/types/stock";

interface HealthCheckProps {
  price: Price;
  ratios: RatioYear[];
}

function getPERating(pe: number | null): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (pe == null || pe <= 0)
    return { label: "N/A", color: "#404E3F", bgColor: "#E5E0D9" };
  if (pe < 15)
    return {
      label: "Looks Cheap",
      color: "#4BC232",
      bgColor: "#4BC232",
    };
  if (pe <= 25)
    return {
      label: "Fair Price",
      color: "#d97706",
      bgColor: "#d97706",
    };
  return {
    label: "Expensive",
    color: "#ef4444",
    bgColor: "#ef4444",
  };
}

export function HealthCheck({ price, ratios }: HealthCheckProps) {
  const latestRatio = ratios.length > 0 ? ratios[ratios.length - 1] : null;
  const peRatio = price.pe_ratio ?? 0;
  const peRating = getPERating(price.pe_ratio);

  const gaugePercent = Math.min(Math.max((peRatio / 50) * 100, 0), 100);

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
          Health Check
          <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
            Financial Ratios
          </Badge>
        </CardTitle>
        <p className="text-sm text-[#404E3F]/60">
          Quick health indicators -- is this stock healthy, fair-priced, and
          growing?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* P/E Ratio Gauge */}
        <div className="p-5 rounded-xl bg-[#F8F3EA]">
          <MetricExplainer
            label="P/E"
            fullForm="Price to Earnings Ratio"
            explanation="Compares the stock price to its earnings. A lower P/E may mean the stock is cheap, while a higher P/E may mean it's expensive or investors expect high growth."
          />
          <div className="flex flex-col items-center mt-4">
            {/* Semi-circle gauge */}
            <div className="relative w-48 h-24 overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 10 95 A 85 85 0 0 1 190 95"
                  fill="none"
                  stroke="#E5E0D9"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Green zone (0-30%) */}
                <path
                  d="M 10 95 A 85 85 0 0 1 64 22"
                  fill="none"
                  stroke="#4BC232"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Yellow zone (30-50%) */}
                <path
                  d="M 64 22 A 85 85 0 0 1 136 22"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Red zone (50-100%) */}
                <path
                  d="M 136 22 A 85 85 0 0 1 190 95"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Needle */}
                <line
                  x1="100"
                  y1="95"
                  x2={
                    100 +
                    80 *
                      Math.cos(
                        Math.PI - (gaugePercent / 100) * Math.PI
                      )
                  }
                  y2={
                    95 -
                    80 *
                      Math.sin(
                        Math.PI - (gaugePercent / 100) * Math.PI
                      )
                  }
                  stroke="#404E3F"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="95" r="6" fill="#404E3F" />
              </svg>
            </div>
            <div className="text-center mt-2">
              <span className="text-3xl font-bold text-[#404E3F]">
                {peRatio > 0 ? peRatio.toFixed(1) : "N/A"}
              </span>
              <Badge
                className="ml-2 text-white"
                style={{ backgroundColor: peRating.bgColor }}
              >
                {peRating.label}
              </Badge>
            </div>
            <p className="text-xs text-[#404E3F]/60 mt-1">
              Under 15 = cheap | 15-25 = fair | Over 25 = expensive (for PSX
              stocks)
            </p>
          </div>
        </div>

        {/* Net Profit Margin */}
        {latestRatio && latestRatio.net_profit_margin != null && (
          <div className="p-5 rounded-xl bg-[#F3F1E5]">
            <div className="flex items-center justify-between mb-3">
              <MetricExplainer
                label="Net Profit Margin"
                explanation="Out of every Rs. 100 the company earns, how much is actual profit? Higher is better. A margin of 20% means Rs. 20 profit for every Rs. 100 earned."
              />
              <span className="text-sm font-semibold text-[#404E3F]">
                {latestRatio.net_profit_margin.toFixed(1)}%
              </span>
            </div>
            <div className="relative h-4 bg-[#E5E0D9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(Math.max(latestRatio.net_profit_margin, 0), 100)}%`,
                  backgroundColor:
                    latestRatio.net_profit_margin >= 15
                      ? "#4BC232"
                      : latestRatio.net_profit_margin >= 5
                        ? "#d97706"
                        : "#ef4444",
                }}
              />
            </div>
            <p className="text-xs text-[#404E3F]/60 mt-2">
              {latestRatio.net_profit_margin >= 15
                ? "Healthy margins -- the company keeps a good chunk of its revenue as profit."
                : latestRatio.net_profit_margin >= 5
                  ? "Average margins -- the company is profitable but could do better."
                  : "Low margins -- the company keeps very little profit from its revenue."}
            </p>
          </div>
        )}

        {/* EPS Growth */}
        {latestRatio && latestRatio.eps_growth != null && (
          <div className="p-5 rounded-xl bg-[#F8F3EA]">
            <div className="flex items-center justify-between">
              <MetricExplainer
                label="EPS Growth"
                fullForm="Earnings Per Share Growth"
                explanation="Is the profit per share going up or down compared to last year? Positive growth means the company is earning more per share."
              />
              <div className="flex items-center gap-2">
                {latestRatio.eps_growth >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-[#4BC232]" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-500" />
                )}
                <span
                  className={`text-2xl font-bold ${
                    latestRatio.eps_growth >= 0
                      ? "text-[#4BC232]"
                      : "text-red-500"
                  }`}
                >
                  {latestRatio.eps_growth >= 0 ? "+" : ""}
                  {latestRatio.eps_growth.toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-[#404E3F]/60 mt-2">
              {latestRatio.eps_growth >= 10
                ? "Strong growth! The company's per-share profit is increasing nicely."
                : latestRatio.eps_growth >= 0
                  ? "Moderate growth -- per-share profit is stable or slowly rising."
                  : "Per-share profit is shrinking. This needs watching."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
