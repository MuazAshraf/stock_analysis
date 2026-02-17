"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import { formatPKR, formatPercent, formatMarketCap } from "@/lib/format";
import {
  Building2,
  Globe,
  User,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import type { Company, Price, Equity } from "@/types/stock";

interface CompanyOverviewProps {
  company: Company;
  price: Price;
  equity: Equity;
}

export function CompanyOverview({
  company,
  price,
  equity,
}: CompanyOverviewProps) {
  const change = price.change ?? 0;
  const isPositive = change >= 0;
  const priceColor = isPositive ? "text-[#4BC232]" : "text-red-500";

  const w52High = price.week52_high ?? 0;
  const w52Low = price.week52_low ?? 0;
  const currentPrice = price.current ?? 0;
  const range52 = w52High - w52Low;
  const rangePercent =
    range52 > 0 ? ((currentPrice - w52Low) / range52) * 100 : 50;

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-2xl font-bold text-[#404E3F]">
              {company.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="bg-[#2B5288] text-white text-xs"
              >
                {company.symbol}
              </Badge>
              <Badge
                variant="outline"
                className="border-[#4BC232] text-[#4BC232] text-xs"
              >
                {company.sector}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-3xl font-bold text-[#404E3F]">
                Rs. {currentPrice.toFixed(2)}
              </span>
            </div>
            <div className={`flex items-center gap-1 justify-end ${priceColor}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-semibold">
                {isPositive ? "+" : ""}
                {change.toFixed(2)} ({formatPercent(price.change_percent ?? 0)})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Description */}
        {company.description && (
          <div className="bg-[#F8F3EA] rounded-lg p-4">
            <p className="text-sm font-medium text-[#404E3F] mb-1">
              What does this company do?
            </p>
            <p className="text-sm text-[#404E3F]/80 leading-relaxed">
              {company.description}
            </p>
          </div>
        )}

        {/* Key info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {company.ceo && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#F3F1E5]">
              <User className="h-4 w-4 text-[#2B5288] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#404E3F]/60">CEO</p>
                <p className="text-sm font-medium text-[#404E3F]">
                  {company.ceo}
                </p>
              </div>
            </div>
          )}
          {company.chairman && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#F3F1E5]">
              <User className="h-4 w-4 text-[#2B5288] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#404E3F]/60">Chairman</p>
                <p className="text-sm font-medium text-[#404E3F]">
                  {company.chairman}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-[#F3F1E5]">
            <Building2 className="h-4 w-4 text-[#2B5288] mt-0.5 flex-shrink-0" />
            <div>
              <MetricExplainer
                label="Market Cap"
                explanation="Total value of all the company's shares combined. A bigger number means a bigger company."
              />
              <p className="text-sm font-medium text-[#404E3F]">
                {formatMarketCap(equity.market_cap_thousands)}
              </p>
            </div>
          </div>
          {company.website && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#F3F1E5]">
              <Globe className="h-4 w-4 text-[#2B5288] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#404E3F]/60">Website</p>
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#2B5288] hover:underline truncate block max-w-[180px]"
                >
                  {company.website}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 52-Week Range */}
        {w52Low > 0 && w52High > 0 && (
          <div className="p-4 rounded-lg bg-[#F8F3EA]">
            <MetricExplainer
              label="52-Week Price Range"
              explanation="The lowest and highest price this stock reached in the past year. It helps you see if the current price is near the top or bottom."
            />
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#404E3F]/70">
                  Low: Rs. {w52Low.toFixed(2)}
                </span>
                <span className="text-[#404E3F]/70">
                  High: Rs. {w52High.toFixed(2)}
                </span>
              </div>
              <div className="relative h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full w-1 bg-[#404E3F] rounded-full shadow-md"
                  style={{ left: `${Math.min(Math.max(rangePercent, 2), 98)}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <ArrowRight className="h-3 w-3 text-[#404E3F]/60" />
                <span className="text-xs text-[#404E3F]/70">
                  Current price is at {rangePercent.toFixed(0)}% of the 52-week
                  range
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickStat label="Open" value={price.open != null ? `Rs. ${price.open.toFixed(2)}` : "N/A"} />
          <QuickStat label="Day High" value={price.high != null ? `Rs. ${price.high.toFixed(2)}` : "N/A"} />
          <QuickStat label="Day Low" value={price.low != null ? `Rs. ${price.low.toFixed(2)}` : "N/A"} />
          <QuickStat
            label="Volume"
            value={price.volume != null ? price.volume.toLocaleString("en-PK") : "N/A"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-[#F3F1E5]">
      <p className="text-xs text-[#404E3F]/60">{label}</p>
      <p className="text-sm font-semibold text-[#404E3F]">{value}</p>
    </div>
  );
}
