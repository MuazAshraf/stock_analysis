"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck, ShieldAlert, Users, TrendingUp, TrendingDown, Info } from "lucide-react";
import { useChartColors } from "@/components/theme-toggle";
import type { Price, RatioYear } from "@/types/stock";

interface TradingInfoProps {
  price: Price;
  ratios?: RatioYear[];
}

export function TradingInfo({ price, ratios }: TradingInfoProps) {
  const c = useChartColors();
  const ldcp = price.ldcp;
  const currentClose = price.current;
  const openPrice = price.open;

  const buyerStrong =
    currentClose != null && openPrice != null && currentClose > openPrice;
  const sellerStrong =
    currentClose != null && openPrice != null && currentClose < openPrice;

  const cbLow = price.circuit_breaker_low;
  const cbHigh = price.circuit_breaker_high;

  // Get latest ratio data
  const latestRatio = ratios && ratios.length > 0 ? ratios[ratios.length - 1] : null;
  const peRatio = price.pe_ratio;
  const netProfitMargin = latestRatio?.net_profit_margin ?? null;
  const epsGrowth = latestRatio?.eps_growth ?? null;

  return (
    <Card className="border-brand-border bg-brand-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-brand-fg flex items-center gap-2">
          Trading Info
          <Badge className="bg-brand-bg text-brand-fg text-xs font-normal">
            Daily Indicators
          </Badge>
        </CardTitle>
        <p className="text-sm text-brand-fg/60">
          Key trading signals that show buyer and seller activity today.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Health Snapshot — 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* LDCP */}
          <QuickMetric
            label="LDCP"
            info="Last Day Closing Price — the price at which this stock closed yesterday. Today's gain or loss is measured from this price."
          >
            {ldcp != null ? (
              <>
                <p className="text-xl font-bold text-brand-fg">Rs. {ldcp.toFixed(2)}</p>
                {currentClose != null && currentClose !== ldcp && (
                  <p className={`text-xs font-medium mt-1 ${currentClose > ldcp ? "text-[#4BC232]" : "text-red-500"}`}>
                    {currentClose > ldcp ? "+" : ""}{(currentClose - ldcp).toFixed(2)} today
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-brand-fg/40">N/A</p>
            )}
          </QuickMetric>

          {/* P/E Ratio — SVG gauge */}
          <QuickMetric
            label="P/E Ratio"
            info="Price to Earnings Ratio — how much investors pay for every Rs. 1 of profit. A low P/E may mean the stock is cheap, a high P/E may mean it's expensive or investors expect fast growth."
          >
            {peRatio != null ? (
              <>
                {/* Mini SVG gauge */}
                <div className="relative w-24 h-12 mx-auto overflow-hidden">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <path d="M 10 95 A 85 85 0 0 1 64 22" fill="none" stroke="#4BC232" strokeWidth="14" strokeLinecap="round" />
                    <path d="M 64 22 A 85 85 0 0 1 136 22" fill="none" stroke="#d97706" strokeWidth="14" strokeLinecap="round" />
                    <path d="M 136 22 A 85 85 0 0 1 190 95" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
                    <line
                      x1="100" y1="95"
                      x2={100 + 70 * Math.cos(Math.PI - (Math.min(Math.max(peRatio / 50, 0), 1)) * Math.PI)}
                      y2={95 - 70 * Math.sin(Math.PI - (Math.min(Math.max(peRatio / 50, 0), 1)) * Math.PI)}
                      stroke={c.fg} strokeWidth="3" strokeLinecap="round"
                    />
                    <circle cx="100" cy="95" r="5" fill={c.fg} />
                  </svg>
                </div>
                <p className="text-xl font-bold text-brand-fg">{peRatio.toFixed(1)}</p>
                <p className="text-xs text-brand-fg/60 mt-1">
                  {peRatio < 15 ? "Looks Cheap" : peRatio < 25 ? "Fair Price" : "Expensive"}
                </p>
                <p className="text-[10px] text-brand-fg/40 mt-0.5">
                  &lt;15 cheap | 15-25 fair | &gt;25 expensive
                </p>
              </>
            ) : (
              <p className="text-sm text-brand-fg/40">N/A</p>
            )}
          </QuickMetric>

          {/* Net Profit Margin */}
          <QuickMetric
            label="Profit Margin"
            info="Net Profit Margin — out of every Rs. 100 the company earns from sales, how much becomes actual profit after all expenses. Above 15% is strong, 5-15% is average, below 5% is thin."
          >
            {netProfitMargin != null ? (
              <>
                <p className="text-xl font-bold text-brand-fg">{netProfitMargin.toFixed(1)}%</p>
                <div className="w-full h-2 bg-brand-border rounded-full mt-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(Math.max(netProfitMargin, 0), 100)}%`,
                      backgroundColor: netProfitMargin >= 15 ? "#4BC232" : netProfitMargin >= 5 ? "#d97706" : "#ef4444",
                    }}
                  />
                </div>
                <p className="text-xs text-brand-fg/60 mt-1">
                  {netProfitMargin >= 15 ? "Strong margins" : netProfitMargin >= 5 ? "Average margins" : "Thin margins"}
                </p>
              </>
            ) : (
              <p className="text-sm text-brand-fg/40">N/A</p>
            )}
          </QuickMetric>

          {/* EPS Growth */}
          <QuickMetric
            label="EPS Growth"
            info="Earnings Per Share Growth — how much the per-share profit grew or shrank compared to last year. Positive means the company is earning more per share, negative means it earned less."
          >
            {epsGrowth != null ? (
              <>
                <div className="flex items-center justify-center gap-1.5">
                  {epsGrowth >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-[#4BC232]" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <p className={`text-xl font-bold ${epsGrowth >= 0 ? "text-[#4BC232]" : "text-red-500"}`}>
                    {epsGrowth >= 0 ? "+" : ""}{epsGrowth.toFixed(1)}%
                  </p>
                </div>
                <p className="text-xs text-brand-fg/60 mt-1">
                  {epsGrowth > 10 ? "Growing well" : epsGrowth >= 0 ? "Slow growth" : "Declining"}
                </p>
              </>
            ) : (
              <p className="text-sm text-brand-fg/40">N/A</p>
            )}
          </QuickMetric>
        </div>

        {/* Buyer vs Seller Strength */}
        <div className="p-4 rounded-xl bg-brand-soft">
          <MetricExplainer
            label="Who is Winning Today?"
            explanation="If the current price is higher than today's opening price, buyers are in control (they're pushing the price up). If it's lower, sellers are in control (they're pushing it down)."
          />
          <div className="mt-3 flex items-center gap-3">
            <Users className="h-8 w-8 text-[#2B5288]" />
            {buyerStrong ? (
              <div>
                <span className="text-lg font-bold text-[#4BC232]">
                  Buyers are Stronger
                </span>
                <p className="text-xs text-brand-fg/60">
                  Current price (Rs. {currentClose?.toFixed(2)}) is above
                  today&apos;s open (Rs. {openPrice?.toFixed(2)}) — buyers
                  pushed the price up
                </p>
              </div>
            ) : sellerStrong ? (
              <div>
                <span className="text-lg font-bold text-red-500">
                  Sellers are Stronger
                </span>
                <p className="text-xs text-brand-fg/60">
                  Current price (Rs. {currentClose?.toFixed(2)}) is below
                  today&apos;s open (Rs. {openPrice?.toFixed(2)}) — sellers
                  pushed the price down
                </p>
              </div>
            ) : (
              <div>
                <span className="text-lg font-bold text-brand-fg">
                  Market is Neutral
                </span>
                <p className="text-xs text-brand-fg/60">
                  Price is roughly the same as today&apos;s open — no clear
                  winner yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Circuit Breaker */}
        {cbLow != null && cbHigh != null && (
          <div className="p-4 rounded-xl bg-brand-bg">
            <MetricExplainer
              label="Circuit Breaker"
              fullForm="Price Safety Limit"
              explanation="The stock exchange sets a maximum limit on how much a stock price can go up or down in a single day. If the price hits this limit, trading may be paused to protect investors from extreme swings. Think of it like speed limits on a road."
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-brand-card">
                <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-brand-fg/60">Lower Limit</p>
                  <p className="text-sm font-bold text-red-500">
                    Rs. {cbLow.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-brand-card">
                <ShieldCheck className="h-5 w-5 text-[#4BC232] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-brand-fg/60">Upper Limit</p>
                  <p className="text-sm font-bold text-[#4BC232]">
                    Rs. {cbHigh.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-fg/60 mt-2">
              Today this stock can only trade between Rs. {cbLow.toFixed(2)} and
              Rs. {cbHigh.toFixed(2)}. If it hits either limit, trading may halt
              temporarily.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickMetric({
  label,
  info,
  children,
}: {
  label: string;
  info: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-brand-bg text-center">
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <p className="text-xs font-semibold text-brand-fg/60 uppercase tracking-wide">
          {label}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="inline-flex cursor-help">
              <Info className="h-3.5 w-3.5 text-[#2B5288]/50" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs bg-brand-fg text-white text-sm"
          >
            {info}
          </TooltipContent>
        </Tooltip>
      </div>
      {children}
    </div>
  );
}
