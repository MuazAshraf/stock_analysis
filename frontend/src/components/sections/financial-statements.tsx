"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBillions } from "@/lib/format";
import type { FinancialStatements as FinStmts } from "@/types/stock";

type FreqTab = "annual" | "quarterly";

interface FinancialStatementsProps {
  statements: FinStmts;
}

export function FinancialStatementsSection({
  statements,
}: FinancialStatementsProps) {
  const [freq, setFreq] = useState<FreqTab>("annual");

  const income =
    freq === "annual" ? statements.income_annual : statements.income_quarterly;
  const balance =
    freq === "annual"
      ? statements.balance_annual
      : statements.balance_quarterly;
  const cashflow =
    freq === "annual"
      ? statements.cashflow_annual
      : statements.cashflow_quarterly;

  const hasData = income.length > 0 || balance.length > 0 || cashflow.length > 0;
  if (!hasData) return null;

  return (
    <Card className="border-brand-border bg-brand-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold text-brand-fg flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#2B5288]" />
              Financial Statements
              <Badge className="bg-brand-bg text-brand-fg text-xs font-normal">
                Yahoo Finance
              </Badge>
            </CardTitle>
            <p className="text-sm text-brand-fg/60 mt-1">
              Key highlights from the 3 core financial statements.
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-brand-border bg-brand-bg p-1 gap-1">
            <button
              type="button"
              onClick={() => setFreq("annual")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer",
                freq === "annual"
                  ? "bg-brand-card text-brand-fg shadow-sm"
                  : "text-brand-fg/50 hover:text-brand-fg"
              )}
            >
              Annual
            </button>
            <button
              type="button"
              onClick={() => setFreq("quarterly")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer",
                freq === "quarterly"
                  ? "bg-brand-card text-brand-fg shadow-sm"
                  : "text-brand-fg/50 hover:text-brand-fg"
              )}
            >
              Quarterly
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Income Statement */}
          {income.length > 0 && (
            <StatementCard title="Income Statement" color="#4BC232">
              <StatementTable
                periods={income.map((p) => p.period)}
                rows={[
                  { label: "Revenue", values: income.map((p) => formatBillions(p.revenue)) },
                  { label: "Gross Profit", values: income.map((p) => formatBillions(p.gross_profit)) },
                  { label: "Operating Income", values: income.map((p) => formatBillions(p.operating_income)) },
                  { label: "Net Income", values: income.map((p) => formatBillions(p.net_income)), highlight: true },
                  { label: "EPS", values: income.map((p) => p.eps != null ? `Rs. ${p.eps.toFixed(2)}` : "—") },
                ]}
              />
            </StatementCard>
          )}

          {/* Balance Sheet */}
          {balance.length > 0 && (
            <StatementCard title="Balance Sheet" color="#2B5288">
              <StatementTable
                periods={balance.map((p) => p.period)}
                rows={[
                  { label: "Total Assets", values: balance.map((p) => formatBillions(p.total_assets)), highlight: true },
                  { label: "Total Equity", values: balance.map((p) => formatBillions(p.total_equity)) },
                  { label: "Total Liabilities", values: balance.map((p) => formatBillions(p.total_liabilities)) },
                  { label: "Total Debt", values: balance.map((p) => formatBillions(p.total_debt)) },
                  { label: "Cash", values: balance.map((p) => formatBillions(p.cash)) },
                ]}
              />
            </StatementCard>
          )}

          {/* Cash Flow */}
          {cashflow.length > 0 && (
            <StatementCard title="Cash Flow" color="#E5A100">
              <StatementTable
                periods={cashflow.map((p) => p.period)}
                rows={[
                  { label: "Operating CF", values: cashflow.map((p) => formatBillions(p.operating_cash_flow)), highlight: true },
                  { label: "Investing CF", values: cashflow.map((p) => formatBillions(p.investing_cash_flow)) },
                  { label: "Financing CF", values: cashflow.map((p) => formatBillions(p.financing_cash_flow)) },
                  { label: "Free Cash Flow", values: cashflow.map((p) => formatBillions(p.free_cash_flow)), highlight: true },
                  { label: "Cash at End", values: cashflow.map((p) => formatBillions(p.end_cash)) },
                ]}
              />
            </StatementCard>
          )}
        </div>

        <p className="text-xs text-brand-fg/40 mt-4 text-center">
          Data sourced from Yahoo Finance. All amounts in PKR. Numbers may
          differ slightly from PSX filings due to rounding or data timing.
        </p>
      </CardContent>
    </Card>
  );
}

function StatementCard({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-brand-border overflow-hidden">
      <div
        className="px-4 py-2.5 text-white text-sm font-semibold"
        style={{ backgroundColor: color }}
      >
        {title}
      </div>
      <div className="bg-brand-card">{children}</div>
    </div>
  );
}

interface TableRow {
  label: string;
  values: string[];
  highlight?: boolean;
}

function StatementTable({
  periods,
  rows,
}: {
  periods: string[];
  rows: TableRow[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-brand-bg">
            <th className="text-left p-2.5 font-semibold text-brand-fg whitespace-nowrap">
              Item
            </th>
            {periods.map((p) => (
              <th
                key={p}
                className="text-right p-2.5 font-semibold text-brand-fg whitespace-nowrap"
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className={cn(
                "border-t border-brand-border",
                row.highlight && "bg-brand-bg/60 font-semibold"
              )}
            >
              <td className="p-2.5 text-brand-fg whitespace-nowrap">
                {row.label}
              </td>
              {row.values.map((val, i) => (
                <td
                  key={i}
                  className={cn(
                    "p-2.5 text-right whitespace-nowrap",
                    val.startsWith("-")
                      ? "text-red-500"
                      : "text-brand-fg"
                  )}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
