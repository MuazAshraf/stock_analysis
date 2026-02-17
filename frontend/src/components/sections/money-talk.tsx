"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import { formatCompact } from "@/lib/format";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { FinancialYear } from "@/types/stock";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MoneyTalkProps {
  financials: FinancialYear[];
}

const CHART_GREEN = "#4BC232";
const CHART_BLUE = "#2B5288";
const CHART_ACCENT = "#9ECCFA";

export function MoneyTalk({ financials }: MoneyTalkProps) {
  const sorted = [...financials].sort((a, b) =>
    a.period.localeCompare(b.period)
  );

  const incomes = sorted.map((f) => f.total_income ?? 0);
  const profits = sorted.map((f) => f.profit_after_tax ?? 0);
  const isGrowingIncome =
    incomes.length >= 2 && incomes[incomes.length - 1] > incomes[0];
  const isGrowingProfit =
    profits.length >= 2 && profits[profits.length - 1] > profits[0];

  const incomeData = sorted.map((f) => ({
    year: f.period,
    value: f.total_income ?? 0,
  }));

  const profitData = sorted.map((f) => ({
    year: f.period,
    value: f.profit_after_tax ?? 0,
  }));

  const epsData = sorted.map((f) => ({
    year: f.period,
    value: f.eps ?? 0,
  }));

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
          Money Talk
          <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
            Financial Performance
          </Badge>
        </CardTitle>
        <p className="text-sm text-[#404E3F]/60">
          How much money is this company making, and is it growing?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Income */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <MetricExplainer
              label="Total Income"
              explanation="All the money the company earned from its business operations before paying any expenses. Higher is generally better."
            />
            <TrendBadge isGrowing={isGrowingIncome} />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D9" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#404E3F", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(v) => formatCompact(v)}
                  tick={{ fill: "#404E3F", fontSize: 12 }}
                  width={60}
                />
                <RechartsTooltip
                  formatter={(value) => [
                    `Rs. ${Number(value).toLocaleString("en-PK")}`,
                    "Total Income",
                  ]}
                  contentStyle={{
                    backgroundColor: "#F8F3EA",
                    border: "1px solid #E5E0D9",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {incomeData.map((_, index) => (
                    <Cell
                      key={`income-${index}`}
                      fill={
                        index === incomeData.length - 1
                          ? CHART_GREEN
                          : CHART_BLUE
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit After Tax */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <MetricExplainer
              label="Profit After Tax"
              explanation="The actual profit left after the company pays all expenses and taxes. This is the real bottom line."
            />
            <TrendBadge isGrowing={isGrowingProfit} />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D9" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#404E3F", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(v) => formatCompact(v)}
                  tick={{ fill: "#404E3F", fontSize: 12 }}
                  width={60}
                />
                <RechartsTooltip
                  formatter={(value) => [
                    `Rs. ${Number(value).toLocaleString("en-PK")}`,
                    "Profit After Tax",
                  ]}
                  contentStyle={{
                    backgroundColor: "#F8F3EA",
                    border: "1px solid #E5E0D9",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {profitData.map((entry, index) => (
                    <Cell
                      key={`profit-${index}`}
                      fill={entry.value >= 0 ? CHART_GREEN : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EPS Trend */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <MetricExplainer
              label="EPS"
              fullForm="Earnings Per Share"
              explanation="How much profit the company made for each single share. If you own 1 share, this is your slice of the profit pie."
            />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={epsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D9" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#404E3F", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#404E3F", fontSize: 12 }}
                  width={50}
                />
                <RechartsTooltip
                  formatter={(value) => [
                    `Rs. ${Number(value).toFixed(2)}`,
                    "EPS",
                  ]}
                  contentStyle={{
                    backgroundColor: "#F8F3EA",
                    border: "1px solid #E5E0D9",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={CHART_ACCENT}>
                  {epsData.map((entry, index) => (
                    <Cell
                      key={`eps-${index}`}
                      fill={entry.value >= 0 ? CHART_BLUE : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendBadge({ isGrowing }: { isGrowing: boolean }) {
  if (isGrowing) {
    return (
      <Badge className="bg-[#4BC232]/10 text-[#4BC232] border-[#4BC232]/30 gap-1">
        <TrendingUp className="h-3 w-3" /> Growing
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-50 text-red-500 border-red-200 gap-1">
      <TrendingDown className="h-3 w-3" /> Declining
    </Badge>
  );
}
