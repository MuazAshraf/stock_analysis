"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingDown, TrendingUp, Minus, Info } from "lucide-react";
import Link from "next/link";
import type { ValueCheck } from "@/types/stock";

interface ValueCheckProps {
  data: ValueCheck;
}

function fmtPKR(n: number | null | undefined) {
  if (n == null || !isFinite(n)) return "—";
  return `Rs. ${n.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
}

function getVerdictConfig(verdict: ValueCheck["verdict"]) {
  switch (verdict) {
    case "undervalued":
      return {
        label: "Undervalued",
        color: "#4BC232",
        bg: "bg-[#4BC232]/10",
        border: "border-[#4BC232]/30",
        icon: TrendingUp,
        urdu: "Yeh stock apni asal qeemat se sasta lag raha hai — margin of safety achi hai",
      };
    case "overvalued":
      return {
        label: "Overvalued",
        color: "#ef4444",
        bg: "bg-red-50",
        border: "border-red-200",
        icon: TrendingDown,
        urdu: "Yeh stock apni asal qeemat se mehenga lag raha hai — ehtiyaat zaruri hai",
      };
    case "fair":
      return {
        label: "Fairly Priced",
        color: "#d97706",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: Minus,
        urdu: "Yeh stock apni sahi qeemat ke qareeb hai — buffer kam hai",
      };
    default:
      return {
        label: "Not Available",
        color: "#71717a",
        bg: "bg-[#F8F3EA]",
        border: "border-[#E5E0D9]",
        icon: Info,
        urdu: "Is stock ke liye intrinsic value calculate nahi ho sakti",
      };
  }
}

export function ValueCheckSection({ data }: ValueCheckProps) {
  const cfg = getVerdictConfig(data.verdict);
  const Icon = cfg.icon;
  const isApplicable = data.verdict !== "not_applicable";
  const margin = data.margin_of_safety;

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
          <Scale className="h-5 w-5 text-[#2B5288]" aria-hidden="true" />
          Value Check
          <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
            Graham Number
          </Badge>
        </CardTitle>
        <p className="text-sm text-[#404E3F]/60">
          Is this stock cheap or expensive compared to its <em>real</em> worth?{" "}
          <Link
            href="/learn/intrinsic-value-margin-of-safety"
            className="text-[#2B5288] underline hover:no-underline"
          >
            Learn how this works
          </Link>
          .
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Verdict banner */}
        <div className={`p-5 rounded-xl ${cfg.bg} border ${cfg.border}`}>
          <div className="flex items-center gap-3">
            <Icon className="h-10 w-10" style={{ color: cfg.color }} aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-[#404E3F]/60">Verdict</p>
              <p className="text-2xl font-bold" style={{ color: cfg.color }}>
                {cfg.label}
              </p>
            </div>
          </div>
          <p className="text-sm text-[#404E3F]/80 mt-3 leading-relaxed">
            {data.explanation}
          </p>
          <p className="text-xs text-[#404E3F]/50 mt-2 italic">{cfg.urdu}</p>
        </div>

        {isApplicable && (
          <>
            {/* Numbers grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#F8F3EA]">
                <p className="text-xs text-[#404E3F]/60">Intrinsic Value</p>
                <p className="text-lg font-bold text-[#404E3F] mt-1">
                  {fmtPKR(data.intrinsic_value)}
                </p>
                <p className="text-[10px] text-[#404E3F]/50 mt-1">per share</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F3EA]">
                <p className="text-xs text-[#404E3F]/60">Current Price</p>
                <p className="text-lg font-bold text-[#404E3F] mt-1">
                  {fmtPKR(data.current_price)}
                </p>
                <p className="text-[10px] text-[#404E3F]/50 mt-1">market price</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F3EA]">
                <p className="text-xs text-[#404E3F]/60">Margin of Safety</p>
                <p
                  className="text-lg font-bold mt-1"
                  style={{ color: cfg.color }}
                >
                  {margin == null ? "—" : `${(margin * 100).toFixed(1)}%`}
                </p>
                <p className="text-[10px] text-[#404E3F]/50 mt-1">
                  buffer vs. fair value
                </p>
              </div>
            </div>

            {/* Margin meter */}
            {margin != null && (
              <div className="p-4 rounded-xl bg-[#F3F1E5]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#404E3F]/60">
                    Margin of Safety scale
                  </p>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: cfg.color }}
                  >
                    {(margin * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="relative h-3 bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 h-full w-1.5 bg-[#404E3F] rounded-full shadow-md transition-all duration-700"
                    style={{
                      left: `${Math.min(Math.max((margin + 0.5) * 100, 2), 98)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-red-500">Overvalued</span>
                  <span className="text-[10px] text-yellow-600">Fair</span>
                  <span className="text-[10px] text-green-600">Undervalued</span>
                </div>
              </div>
            )}

            {/* Inputs used */}
            <div className="p-3 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]">
              <p className="text-xs font-medium text-[#404E3F]/60 mb-2">
                Numbers used in this calculation
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#404E3F]/60">EPS:</span>{" "}
                  <span className="font-mono text-[#404E3F]">
                    {fmtPKR(data.eps_used)}
                  </span>
                </div>
                <div>
                  <span className="text-[#404E3F]/60">Book Value/Share:</span>{" "}
                  <span className="font-mono text-[#404E3F]">
                    {fmtPKR(data.book_value_used)}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-[#404E3F]/50 mt-2 leading-relaxed">
                Graham Number = √(22.5 × EPS × Book Value per Share). Educational
                use only — not a buy or sell recommendation.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
