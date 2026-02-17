"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { IndexPoint } from "@/types/stock";

interface MarketTickerProps {
  indices: IndexPoint[];
}

export function MarketTicker({ indices }: MarketTickerProps) {
  if (!indices || indices.length === 0) return null;

  const mainIndices = indices.filter(
    (idx) =>
      idx.name.toUpperCase().includes("KSE100") ||
      idx.name.toUpperCase().includes("KSE30") ||
      idx.name.toUpperCase().includes("ALLSHR")
  );

  const display = mainIndices.length > 0 ? mainIndices : indices.slice(0, 3);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {display.map((idx) => {
        const isUp = (idx.change ?? 0) >= 0;
        return (
          <div
            key={idx.name}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E5E0D9] shadow-sm"
          >
            <span className="text-xs font-semibold text-[#2B5288]">
              {idx.name}
            </span>
            <span className="text-sm font-bold text-[#404E3F]">
              {idx.value?.toLocaleString("en-PK") ?? "N/A"}
            </span>
            {idx.change != null && (
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  isUp ? "text-[#4BC232]" : "text-red-500"
                }`}
              >
                {isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isUp ? "+" : ""}
                {idx.change.toFixed(1)}
                {idx.change_percent != null &&
                  ` (${idx.change_percent.toFixed(2)}%)`}
              </span>
            )}
          </div>
        );
      })}
      <div className="flex items-center px-3 py-2 rounded-lg bg-[#F3F1E5] text-[10px] text-[#404E3F]/60">
        Today&apos;s market indices — shows overall market direction
      </div>
    </div>
  );
}
