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

  const { upcoming, past, recentlyPaid } = useMemo(() => {
    const upcomingList: { payout: Payout; start: Date; end: Date }[] = [];
    const pastList: { payout: Payout; start: Date; end: Date }[] = [];
    const undatedPast: Payout[] = [];

    for (const p of payouts) {
      const range = parseBookClosure(p.book_closure);
      if (!range) {
        undatedPast.push(p);
        continue;
      }
      if (daysUntil(range.end) >= 0) {
        upcomingList.push({ payout: p, start: range.start, end: range.end });
      } else {
        pastList.push({ payout: p, start: range.start, end: range.end });
      }
    }

    upcomingList.sort((a, b) => a.end.getTime() - b.end.getTime());
    pastList.sort((a, b) => b.end.getTime() - a.end.getTime()); // newest first

    // "Recently paid" = the most recent past payout whose book closure ended
    // within the last 45 days. Credit usually hits ~10-15 days after BC ends,
    // so a 45-day window covers the typical "just paid" feeling.
    const mostRecentPast = pastList[0];
    const recentlyPaid =
      mostRecentPast && Math.abs(daysUntil(mostRecentPast.end)) <= 45
        ? mostRecentPast
        : null;

    return {
      upcoming: upcomingList,
      past: [...pastList.map((p) => p.payout), ...undatedPast],
      recentlyPaid,
    };
  }, [payouts]);

  return (
    <Card className="border-brand-border bg-brand-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-brand-fg flex items-center gap-2">
          Dividend Check
          <Badge className="bg-brand-bg text-brand-fg text-xs font-normal">
            Payouts
          </Badge>
        </CardTitle>
        <p className="text-sm text-brand-fg/60">
          Does this company share its profits with shareholders?
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Big YES/NO */}
        <div className="flex items-center justify-center p-6 rounded-xl bg-brand-bg">
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
              <p className="text-sm text-brand-fg/70 mt-2">
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
              <h4 className="text-sm font-bold text-brand-fg">
                {upcoming.length === 1 ? "Upcoming Dividend" : `${upcoming.length} Upcoming Dividends`}
              </h4>
              <Badge className="bg-[#4BC232] text-white text-[10px] uppercase tracking-wider">
                Coming Soon
              </Badge>
            </div>
            <div className="space-y-3">
              {upcoming.map(({ payout, start, end }, idx) => {
                // Use START date for the countdown — that's the deadline to
                // own the stock. Counting to END (the old behavior) is
                // misleading because buying inside the closure window doesn't
                // qualify you for the dividend.
                const daysToStart = daysUntil(start);
                const inClosure = daysToStart < 0 && daysUntil(end) >= 0;
                const label = inClosure ? "In closure now" : "Buy by";
                const value = inClosure
                  ? "Closes " + (daysUntil(end) === 0 ? "today" : `in ${daysUntil(end)} day${daysUntil(end) === 1 ? "" : "s"}`)
                  : daysToStart === 0
                    ? "Today"
                    : daysToStart === 1
                      ? "1 day left"
                      : `${daysToStart} days left`;
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-brand-card border border-brand-border"
                  >
                    <div>
                      <p className="text-sm font-semibold text-brand-fg">
                        {payout.details ?? "—"}
                      </p>
                      <p className="text-xs text-brand-fg/60 mt-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        Book Closure: {fmtDateLong(start)} → {fmtDateLong(end)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-brand-fg/50">{label}</p>
                      <p className="text-sm font-bold text-[#4BC232]">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-brand-fg/60 leading-relaxed">
              To receive an upcoming dividend, you must own the stock <strong>before the book closure start date</strong>. Buying after the closure begins means you will not be eligible for that dividend.
            </p>
          </div>
        )}

        {/* Recently paid — book closure ended within the last 45 days. Shows a
            positive "just paid out" badge so users don't see a cold
            'no upcoming' message right after a successful payout. */}
        {upcoming.length === 0 && recentlyPaid && (
          <div className="rounded-xl border border-[#4BC232]/30 bg-[#4BC232]/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CircleCheck className="h-5 w-5 text-[#4BC232]" aria-hidden="true" />
              <h4 className="text-sm font-bold text-brand-fg">Recently Paid Dividend</h4>
              <Badge className="bg-[#4BC232] text-white text-[10px] uppercase tracking-wider">
                Just Paid
              </Badge>
            </div>
            <p className="text-sm font-semibold text-brand-fg">
              {recentlyPaid.payout.details ?? "—"}
            </p>
            <p className="text-xs text-brand-fg/70 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Book closure: {fmtDateLong(recentlyPaid.start)} → {fmtDateLong(recentlyPaid.end)}
              {" "}
              ({Math.abs(daysUntil(recentlyPaid.end))} days ago)
            </p>
            <p className="text-[11px] text-brand-fg/60 leading-relaxed">
              Cash dividend was paid out to shareholders who held the stock before book closure. The next dividend will appear here once the company&apos;s board declares it.
            </p>
          </div>
        )}

        {/* No-recent-payout fallback — only when there are past payouts but
            the most recent one isn't recent enough to count as "just paid". */}
        {upcoming.length === 0 && !recentlyPaid && past.length > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-brand-bg border border-brand-border">
            <Calendar className="h-4 w-4 text-brand-fg/60 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-brand-fg/70 leading-relaxed">
              <strong>No upcoming dividend announced yet.</strong> The next dividend will appear here automatically once the company&apos;s board declares it — usually a few weeks before the book closure date.
            </p>
          </div>
        )}

        {/* Past dividend history table */}
        {past.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-brand-fg mb-3">
              Dividend History
            </h4>
            <div className="overflow-x-auto rounded-lg border border-brand-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-soft">
                    <th className="text-left p-3 font-semibold text-brand-fg">
                      Announcement Date
                    </th>
                    <th className="text-left p-3 font-semibold text-brand-fg">
                      Dividend
                    </th>
                    <th className="text-left p-3 font-semibold text-brand-fg">
                      Book Closure
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((payout, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-brand-border hover:bg-brand-bg/50"
                    >
                      <td className="p-3 text-brand-fg">
                        {payout.date ?? "—"}
                      </td>
                      <td className="p-3 font-medium text-brand-fg">
                        {payout.details ?? "—"}
                      </td>
                      <td className="p-3 text-brand-fg/70">
                        {payout.book_closure ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-brand-fg/50 mt-2 text-center">
              Showing {past.length} past payout{past.length === 1 ? "" : "s"} from PSX Data Portal
            </p>
            <p className="text-xs text-brand-fg/40 mt-1 text-center">
              Tip: &quot;% of face value&quot; means percentage of the share&apos;s
              par value (usually Rs. 10, but can be Rs. 5 or Rs. 1 depending
              on the company). Check the company profile for exact face value.
            </p>
          </div>
        )}

        {!hasDividends && (
          <div className="text-center p-4 rounded-lg bg-brand-soft space-y-2">
            <p className="text-sm text-brand-fg/70">
              No dividend records found on the PSX Data Portal for this stock.
            </p>
            <p className="text-xs text-brand-fg/50">
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
