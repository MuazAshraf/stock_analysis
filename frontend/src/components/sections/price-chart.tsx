"use client";

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
import type { PricePoint } from "@/types/stock";

interface PriceChartProps {
  data: PricePoint[];
  symbol: string;
}

export function PriceChart({ data, symbol }: PriceChartProps) {
  if (data.length < 2) return null;

  const first = data[0].close;
  const last = data[data.length - 1].close;
  const change = last - first;
  const changePct = (change / first) * 100;
  const isUp = change >= 0;

  const chartData = data.map((p) => ({
    date: p.date,
    label: new Date(p.date).toLocaleDateString("en-PK", {
      month: "short",
      year: "2-digit",
    }),
    close: p.close,
  }));

  const minPrice = Math.min(...data.map((p) => p.close));
  const maxPrice = Math.max(...data.map((p) => p.close));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
              Price History
              <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
                1 Year
              </Badge>
            </CardTitle>
            <p className="text-sm text-[#404E3F]/60 mt-1">
              Weekly closing price of {symbol} over the past year
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
                {changePct.toFixed(1)}% in 1 year
              </p>
              <p className="text-xs text-[#404E3F]/50">
                Rs. {first.toFixed(2)} → Rs. {last.toFixed(2)}
              </p>
            </div>
          </div>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#404E3F80" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E0D9" }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                tick={{ fontSize: 11, fill: "#404E3F80" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `Rs.${v.toFixed(0)}`}
                width={65}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #E5E0D9",
                  borderRadius: "8px",
                  fontSize: "12px",
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
        <p className="text-xs text-[#404E3F]/40 mt-2 text-center">
          Weekly closing prices from Yahoo Finance. Past performance does not
          guarantee future results.
        </p>
      </CardContent>
    </Card>
  );
}
