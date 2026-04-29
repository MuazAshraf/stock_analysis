"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import { CircleCheck, CircleX, AlertTriangle, Calendar, Sparkles } from "lucide-react";
import type { Payout } from "@/types/stock";

interface DividendCheckProps {
  payouts: Payout[];
  dividendStatus: string;
}

/**
 * Parse a PSX book closure string like "03/11/2025  - 05/11/2025" into start/end dates.
 * Returns null if either date can't be parsed.
 */
function parseBookClosure(s: string | null | undefined): { start: Date; end: Date } | null {
  if (!s) return null;
  const parts = s.split(/\s*-\s*/);
  if (parts.length < 2) return null;
  const parseDmy = (dmy: string): Date | null => {
    const m = dmy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const [, dd, mm, yyyy] = m;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isNaN(date.getTime()) ? null : date;
  };
  const start = parseDmy(parts[0]);
  const end = parseDmy(parts[1]);
  if (!start || !end) return null;
  return { start, end };
}

function daysUntil(target: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  return Math.round((t.getTime() - today.getTime()) / 86_400_000);
}

function fmtDateLong(date: Date): string {
  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DividendCheck({ payouts, dividendStatus }: DividendCheckProps) {
  const hasDividends = payouts.length > 0;

  const { upcoming, past } = useMemo(() => {
    const upcomingList: { payout: Payout; start: Date; end: Date }[] = [];
    const pastList: Payout[] = [];

    for (const p of payouts) {
      const range = parseBookClosure(p.book_closure);
      if (range && daysUntil(range.end) >= 0) {
        upcomingList.push({ payout: p, start: range.start, end: range.end });
      } else {
        pastList.push(p);
      }
    }

    upcomingList.sort((a, b) => a.end.getTime() - b.end.getTime());
    return { upcoming: upcomingList, past: pastList };
  }, [payouts]);

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
          Dividend Check
          <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
            Payouts
          </Badge>
        </CardTitle>
        <p className="text-sm text-[#404E3F]/60">
          Does this company share its profits with shareholders?
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Big YES/NO */}
        <div className="flex items-center justify-center p-6 rounded-xl bg-[#F8F3EA]">
          <div className="text-center">
            <MetricExplainer
              label="Pays Dividends?"
              explanation="Dividends are when a company shares some of its profit directly with you as cash. It's like getting a bonus just for owning the stock."
            />
            <div className="mt-3 flex items-center justify-center gap-3">
              {hasDividends ? (
                <>
                  <CircleCheck className="h-12 w-12 text-[#4BC232]" />
                  <span className="text-3xl font-bold text-[#4BC232]">
                    YES
                  </span>
                </>
              ) : (
                <>
                  <CircleX className="h-12 w-12 text-red-400" />
                  <span className="text-3xl font-bold text-red-400">NO</span>
                </>
              )}
            </div>
            {dividendStatus && (
              <p className="text-sm text-[#404E3F]/70 mt-2">
                {dividendStatus}
              </p>
            )}
          </div>
        </div>

        {/* Upcoming dividends — only show if any */}
        {upcoming.length > 0 && (
          <div className="rounded-xl border border-[#4BC232]/30 bg-[#4BC232]/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#4BC232]" aria-hidden="true" />
              <h4 className="text-sm font-bold text-[#404E3F]">
                {upcoming.length === 1 ? "Upcoming Dividend" : `${upcoming.length} Upcoming Dividends`}
              </h4>
              <Badge className="bg-[#4BC232] text-white text-[10px] uppercase tracking-wider">
                Coming Soon
              </Badge>
            </div>
            <div className="space-y-3">
              {upcoming.map(({ payout, start, end }, idx) => {
                const daysLeft = daysUntil(end);
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-white border border-[#E5E0D9]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#404E3F]">
                        {payout.details ?? "—"}
                      </p>
                      <p className="text-xs text-[#404E3F]/60 mt-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        Book Closure: {fmtDateLong(start)} → {fmtDateLong(end)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-[#404E3F]/50">Closes in</p>
                      <p className="text-sm font-bold text-[#4BC232]">
                        {daysLeft === 0
                          ? "Today"
                          : daysLeft === 1
                          ? "1 day"
                          : `${daysLeft} days`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#404E3F]/60 leading-relaxed">
              To receive an upcoming dividend, you must own the stock <strong>before the book closure start date</strong>. Buying after the closure begins means you will not be eligible for that dividend.
            </p>
          </div>
        )}

        {/* No upcoming dividend hint — show only when there are past payouts but nothing upcoming */}
        {upcoming.length === 0 && past.length > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]">
            <Calendar className="h-4 w-4 text-[#404E3F]/60 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-[#404E3F]/70 leading-relaxed">
              <strong>No upcoming dividend announced yet.</strong> The next dividend will appear here automatically once the company&apos;s board declares it — usually a few weeks before the book closure date.
            </p>
          </div>
        )}

        {/* Past dividend history table */}
        {past.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[#404E3F] mb-3">
              Dividend History
            </h4>
            <div className="overflow-x-auto rounded-lg border border-[#E5E0D9]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F3F1E5]">
                    <th className="text-left p-3 font-semibold text-[#404E3F]">
                      Announcement Date
                    </th>
                    <th className="text-left p-3 font-semibold text-[#404E3F]">
                      Dividend
                    </th>
                    <th className="text-left p-3 font-semibold text-[#404E3F]">
                      Book Closure
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((payout, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-[#E5E0D9] hover:bg-[#F8F3EA]/50"
                    >
                      <td className="p-3 text-[#404E3F]">
                        {payout.date ?? "—"}
                      </td>
                      <td className="p-3 font-medium text-[#404E3F]">
                        {payout.details ?? "—"}
                      </td>
                      <td className="p-3 text-[#404E3F]/70">
                        {payout.book_closure ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#404E3F]/50 mt-2 text-center">
              Showing {past.length} past payout{past.length === 1 ? "" : "s"} from PSX Data Portal
            </p>
            <p className="text-xs text-[#404E3F]/40 mt-1 text-center">
              Tip: &quot;% of face value&quot; means percentage of the share&apos;s
              par value (usually Rs. 10, but can be Rs. 5 or Rs. 1 depending
              on the company). Check the company profile for exact face value.
            </p>
          </div>
        )}

        {!hasDividends && (
          <div className="text-center p-4 rounded-lg bg-[#F3F1E5] space-y-2">
            <p className="text-sm text-[#404E3F]/70">
              No dividend records found on the PSX Data Portal for this stock.
            </p>
            <p className="text-xs text-[#404E3F]/50">
              Note: Some companies DO pay dividends but the PSX portal may not
              list them here. Check the company&apos;s annual report or investor
              relations page to confirm dividend history.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-800">
              Important Note
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Dividends are never guaranteed. A company only pays dividends when
              it is profitable, has healthy cash flow, and the board of directors
              approves the payout. Even well-known stocks can reduce or skip
              dividends when their industry is going through a slowdown. Past
              dividends do not guarantee future payments — always check the
              latest financial results.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
