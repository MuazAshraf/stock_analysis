"use client";

import { useQuery } from "@tanstack/react-query";
import { getUpcomingDividends } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * Upcoming Dividends Calendar — every PSX stock with an upcoming book-closure
 * date, sorted earliest first. Data comes from the same 30-min cache as the
 * per-stock dividend section, so this page is cheap to render.
 */
export default function DividendsCalendarPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["upcoming-dividends"],
    queryFn: getUpcomingDividends,
    staleTime: 5 * 60 * 1000,
  });

  const [sectorFilter, setSectorFilter] = useState<string>("ALL");

  const { sectors, filtered } = useMemo(() => {
    const rows = data ?? [];
    const sectorSet = new Set<string>();
    for (const r of rows) {
      if (r.sector) sectorSet.add(r.sector);
    }
    const sectorsList = ["ALL", ...Array.from(sectorSet).sort()];
    const filteredRows =
      sectorFilter === "ALL"
        ? rows
        : rows.filter((r) => r.sector === sectorFilter);
    return { sectors: sectorsList, filtered: filteredRows };
  }, [data, sectorFilter]);

  return (
    <main className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-[#4BC232]/10 text-[#4BC232] rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            <Sparkles className="h-4 w-4" />
            Upcoming Dividends Calendar
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-fg mb-2">
            Every PSX stock with an upcoming dividend
          </h1>
          <p className="text-sm text-brand-fg/60 max-w-2xl">
            All companies whose <strong>book closure</strong> ends today or
            later, sorted earliest first. To receive a dividend, you must own
            the stock <strong>before</strong> the book closure start date.
          </p>
        </div>

        {/* Sector filter */}
        {!isLoading && !isError && sectors.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {sectors.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSectorFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  sectorFilter === s
                    ? "bg-[#4BC232] text-white"
                    : "bg-brand-card border border-brand-border text-brand-fg/70 hover:border-[#4BC232]/40"
                }`}
              >
                {s === "ALL" ? "All Sectors" : s}
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {isLoading && <SkeletonList />}

        {isError && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900/50">
            <CardContent className="py-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                  Could not load dividends
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {error instanceof Error
                    ? error.message
                    : "Please try again in a moment."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <Card className="border-brand-border bg-brand-card">
            <CardContent className="py-10 text-center">
              <Calendar className="h-10 w-10 text-brand-fg/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-brand-fg">
                No upcoming dividends right now
              </p>
              <p className="text-xs text-brand-fg/60 mt-1">
                New entries will appear automatically as companies announce
                payouts.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <Card className="border-brand-border bg-brand-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-brand-fg flex items-center gap-2">
                {filtered.length} upcoming
                {sectorFilter !== "ALL" && (
                  <Badge className="bg-brand-bg text-brand-fg text-xs font-normal">
                    {sectorFilter}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DividendList rows={filtered} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

/* ─────────────────── List + helpers ──────────────────────── */

function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-lg bg-brand-soft border border-brand-border animate-pulse"
        />
      ))}
    </div>
  );
}

function DividendList({
  rows,
}: {
  rows: Array<{
    symbol: string;
    company_name: string;
    sector: string;
    details: string;
    book_closure_start: string;
    book_closure_end: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-brand-border">
      <table className="w-full text-sm">
        <thead className="bg-brand-soft text-brand-fg/70">
          <tr>
            <Th>Stock</Th>
            <Th>Dividend</Th>
            <Th>Book Closure</Th>
            <Th>Days Until Start</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <DividendRow key={`${r.symbol}-${r.book_closure_start}`} row={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
  );
}

function DividendRow({
  row,
}: {
  row: {
    symbol: string;
    company_name: string;
    sector: string;
    details: string;
    book_closure_start: string;
    book_closure_end: string;
  };
}) {
  const start = new Date(row.book_closure_start);
  const end = new Date(row.book_closure_end);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilStart = Math.round(
    (start.getTime() - today.getTime()) / 86_400_000,
  );

  const stateLabel =
    daysUntilStart > 0
      ? daysUntilStart === 1
        ? "Tomorrow"
        : `${daysUntilStart} days`
      : daysUntilStart === 0
        ? "Starts today"
        : `In closure now`;

  const stateColor =
    daysUntilStart > 7
      ? "text-[#4BC232]"
      : daysUntilStart >= 0
        ? "text-[#d97706]"
        : "text-brand-fg/60";

  const psxUrl = `https://dps.psx.com.pk/company/${row.symbol}`;

  return (
    <tr className="border-t border-brand-border hover:bg-brand-soft/50">
      <td className="p-3 align-top">
        <a
          href={psxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 group"
        >
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#2B5288]/10 text-[#2B5288] text-xs font-bold group-hover:bg-[#2B5288]/20">
            {row.symbol}
          </span>
          <span className="text-brand-fg text-sm">{row.company_name}</span>
        </a>
        {row.sector && (
          <p className="text-[10px] text-brand-fg/50 mt-0.5">{row.sector}</p>
        )}
      </td>
      <td className="p-3 align-top text-brand-fg">{row.details}</td>
      <td className="p-3 align-top text-brand-fg/80 whitespace-nowrap">
        {fmt(start)} → {fmt(end)}
      </td>
      <td className={`p-3 align-top font-semibold ${stateColor}`}>
        {stateLabel}
      </td>
    </tr>
  );
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
