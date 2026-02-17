"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";

export function Formulas() {
  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
          <Calculator className="h-5 w-5 text-[#2B5288]" />
          Learn the Formulas
          <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
            Education
          </Badge>
        </CardTitle>
        <p className="text-sm text-[#404E3F]/60">
          Important stock formulas explained in simple language, so you know how
          the numbers are calculated.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormulaCard
          title="Book Value Per Share"
          formula="(Total Assets - Total Liabilities) / Total Shares"
          explanation="Imagine the company sold everything it owns and paid off all debts. Whatever is left, divided by total shares, is the book value. If the stock price is below this number, it might be undervalued."
          example="If a company has Rs. 500Cr in assets, Rs. 200Cr in debts, and 10Cr shares: (500 - 200) / 10 = Rs. 30 per share"
        />

        <FormulaCard
          title="Dividend Per Share (DPS)"
          formula="Total Dividends Paid / Total Shares Outstanding"
          explanation="How much cash the company gave back to each shareholder. If DPS is Rs. 5, that means for every share you own, you got Rs. 5 as cash."
          example="Company paid Rs. 50Cr total dividends and has 10Cr shares: 50 / 10 = Rs. 5 per share"
        />

        <FormulaCard
          title="Dividend Yield"
          formula="(Dividend Per Share / Current Stock Price) x 100"
          explanation="Shows what percentage return you get just from dividends (without selling the stock). Higher yield = more cash income. Think of it like interest rate on your investment."
          example="DPS is Rs. 5 and stock price is Rs. 100: (5 / 100) x 100 = 5% yield"
        />

        <FormulaCard
          title="EPS Growth %"
          formula="((Current Year EPS - Last Year EPS) / Last Year EPS) x 100"
          explanation="How much the per-share profit grew compared to last year. Positive means the company is earning more per share. Negative means it earned less."
          example="Last year EPS was Rs. 10, this year Rs. 12: ((12 - 10) / 10) x 100 = 20% growth"
        />

        <FormulaCard
          title="P/E Ratio (Price to Earnings)"
          formula="Current Stock Price / Earnings Per Share (EPS)"
          explanation="How many rupees investors are willing to pay for every Rs. 1 of profit. Low P/E might mean cheap stock, high P/E might mean expensive — or investors expect fast growth."
          example="Stock price Rs. 200, EPS Rs. 10: 200 / 10 = P/E of 20"
        />

        <FormulaCard
          title="Net Profit Margin %"
          formula="(Net Profit / Total Revenue) x 100"
          explanation="Out of every Rs. 100 the company earns from sales, how much ends up as actual profit after all expenses. Higher is better."
          example="Revenue Rs. 100Cr, Net Profit Rs. 25Cr: (25 / 100) x 100 = 25% margin"
        />
      </CardContent>
    </Card>
  );
}

function FormulaCard({
  title,
  formula,
  explanation,
  example,
}: {
  title: string;
  formula: string;
  explanation: string;
  example: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#F8F3EA] space-y-2">
      <h4 className="text-sm font-bold text-[#404E3F]">{title}</h4>
      <div className="px-3 py-2 rounded-lg bg-white border border-[#E5E0D9] font-mono text-sm text-[#2B5288]">
        {formula}
      </div>
      <p className="text-sm text-[#404E3F]/80 leading-relaxed">
        {explanation}
      </p>
      <div className="flex items-start gap-2 text-xs text-[#404E3F]/60">
        <span className="font-semibold text-[#4BC232]">Example:</span>
        <span>{example}</span>
      </div>
    </div>
  );
}
