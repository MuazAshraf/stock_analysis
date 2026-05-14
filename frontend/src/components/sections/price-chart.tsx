"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useChartColors } from "@/components/theme-toggle";
import type { PricePoint } from "@/types/stock";

interface PriceChartProps {
  data: PricePoint[];
  symbol: string;
}

type Range = "1Y" | "5Y";

const RANGE_DAYS: Record<Range, number> = {
  "1Y": 365,
  "5Y": 365 * 5,
};

export function PriceChart({ data, symbol }: PriceChartProps) {
  const c = useChartColors();
  const [range, setRange] = useState<Range>("1Y");

  const filtered = useMemo(() => {
    if (data.length === 0) return [];
    const cutoff = Date.now() - RANGE_DAYS[range] * 86_400_000;
    return data.filter((p) => new Date(p.date).getTime() >= cutoff);
  }, [data, range]);

  if (data.length < 2) return null;
  if (filtered.length < 2) return null;

  const first = filtered[0].close;
  const last = filtered[filtered.length - 1].close;
  const change = last - first;
  const changePct = (change / first) * 100;
  const isUp = change >= 0;

  const chartData = filtered.map((p) => ({
    date: p.date,
    label: new Date(p.date).toLocaleDateString("en-PK", {
      month: "short",
      year: "2-digit",
    }),
    close: p.close,
  }));

  const minPrice = Math.min(...filtered.map((p) => p.close));
  const maxPrice = Math.max(...filtered.map((p) => p.close));
  const padding = (maxPrice - minPrice) * 0.1;

  const rangeLabel = range === "1Y" ? "1 Year" : "5 Years";
  const changeText = range === "1Y" ? "in 1 year" : "in 5 years";

  return (
    <Card className="border-brand-border bg-brand-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold text-brand-fg flex items-center gap-2">
              Price History
              <Badge className="bg-brand-bg text-brand-fg text-xs font-normal">
                {rangeLabel}
              </Badge>
            </CardTitle>
            <p className="text-sm text-brand-fg/60 mt-1">
              Daily closing price of {symbol} over the past{" "}
              {range === "1Y" ? "year" : "five years"}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isUp ? "bg-[#4BC232]/10" : "bg-red-50"
            }`}
          >
            {isUp ? (
              <TrendingUp className="h-5 w-5 text-[#4BC232]" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  isUp ? "text-[#4BC232]" : "text-red-500"
                }`}
              >
                {isUp ? "+" : ""}
                {changePct.toFixed(1)}% {changeText}
              </p>
              <p className="text-xs text-brand-fg/50">
                Rs. {first.toFixed(2)} → Rs. {last.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div
          className="inline-flex items-center gap-1 mt-3 p-1 rounded-lg bg-brand-bg w-fit"
          role="tablist"
          aria-label="Price history range"
        >
          {(Object.keys(RANGE_DAYS) as Range[]).map((r) => {
            const active = range === r;
            return (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  active
                    ? "bg-brand-card text-brand-fg shadow-sm"
                    : "text-brand-fg/60 hover:text-brand-fg"
                }`}
              >
                {r === "1Y" ? "1 Year (Daily)" : "5 Years"}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isUp ? "#4BC232" : "#ef4444"}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={isUp ? "#4BC232" : "#ef4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: `${c.fg}80` }}
                tickLine={false}
                axisLine={{ stroke: c.border }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                tick={{ fontSize: 11, fill: `${c.fg}80` }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `Rs.${v.toFixed(0)}`}
                width={65}
              />
              <Tooltip
                contentStyle={{
                  background: c.card,
                  border: `1px solid ${c.border}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: c.fg,
                }}
                formatter={(value: number | undefined) => [
                  value != null ? `Rs. ${value.toFixed(2)}` : "—",
                  "Close",
                ]}
                labelFormatter={(label) => String(label)}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={isUp ? "#4BC232" : "#ef4444"}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-brand-fg/40 mt-2 text-center">
          Daily closing prices from Pakistan Stock Exchange. Past performance does
          not guarantee future results.
        </p>
      </CardContent>
    </Card>
  );
}
