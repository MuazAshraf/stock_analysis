"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import { CircleCheck, CircleX } from "lucide-react";
import type { Payout } from "@/types/stock";

interface DividendCheckProps {
  payouts: Payout[];
  dividendStatus: string;
}

export function DividendCheck({ payouts, dividendStatus }: DividendCheckProps) {
  const hasDividends = payouts.length > 0;

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

        {/* Dividend history table */}
        {hasDividends && (
          <div>
            <h4 className="text-sm font-semibold text-[#404E3F] mb-3">
              Recent Dividend History
            </h4>
            <div className="overflow-x-auto rounded-lg border border-[#E5E0D9]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F3F1E5]">
                    <th className="text-left p-3 font-semibold text-[#404E3F]">
                      Date
                    </th>
                    <th className="text-left p-3 font-semibold text-[#404E3F]">
                      Period
                    </th>
                    <th className="text-left p-3 font-semibold text-[#404E3F]">
                      Details
                    </th>
                    <th className="text-left p-3 font-semibold text-[#404E3F]">
                      Book Closure
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.slice(0, 8).map((payout, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-[#E5E0D9] hover:bg-[#F8F3EA]/50"
                    >
                      <td className="p-3 text-[#404E3F]">{payout.date}</td>
                      <td className="p-3 text-[#404E3F]/70">
                        {payout.financial_results}
                      </td>
                      <td className="p-3 text-[#404E3F]">
                        {payout.details}
                      </td>
                      <td className="p-3 text-[#404E3F]/70">
                        {payout.book_closure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payouts.length > 8 && (
              <p className="text-xs text-[#404E3F]/50 mt-2 text-center">
                Showing 8 of {payouts.length} records
              </p>
            )}
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
      </CardContent>
    </Card>
  );
}
