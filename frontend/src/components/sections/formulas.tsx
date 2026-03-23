"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, BookOpen, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

type EducationTab = "glossary" | "formulas" | "symbols";

const MARKET_SYMBOLS = [
  { symbol: "XD", meaning: "Ex-Dividend — The stock is trading without the right to the upcoming dividend. If you buy on or after this date, you won't get the dividend." },
  { symbol: "XB", meaning: "Ex-Bonus — The stock is trading without the right to upcoming bonus shares. Buyers after this date won't receive the bonus." },
  { symbol: "XR", meaning: "Ex-Right — The stock is trading without the right to subscribe to new shares at a discounted price." },
  { symbol: "N", meaning: "Newly Listed — This company was recently listed on the exchange. It may have limited trading history." },
  { symbol: "UL", meaning: "Upper Lock / Upper Circuit — The stock hit its maximum allowed price increase for the day. No more buying is possible until the next session." },
  { symbol: "LL", meaning: "Lower Lock / Lower Circuit — The stock hit its maximum allowed price decrease for the day. No more selling is possible until the next session." },
  { symbol: "NC", meaning: "Not in any index Category — The stock is not part of KSE-100, KSE-30, or KMI-30 indices." },
  { symbol: "S", meaning: "Suspended — Trading in this stock has been temporarily halted by the exchange, usually due to non-compliance or pending announcements." },
  { symbol: "H", meaning: "Halt — Trading is temporarily paused, often due to a significant pending announcement that could affect the stock price." },
  { symbol: "Z", meaning: "Defaulter / Non-Compliant — The company has failed to meet PSX listing requirements (e.g., not filing reports). Trade with extra caution." },
];

export function Formulas() {
  const [activeTab, setActiveTab] = useState<EducationTab>("glossary");

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
          Learn the Basics
          <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
            Education
          </Badge>
        </CardTitle>
        <p className="text-sm text-[#404E3F]/60">
          New to investing? Learn what the numbers mean and how they are
          calculated.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab toggle */}
        <div className="inline-flex rounded-lg border border-[#E5E0D9] bg-[#F8F3EA] p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("glossary")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer",
              activeTab === "glossary"
                ? "bg-white text-[#404E3F] shadow-sm"
                : "text-[#404E3F]/50 hover:text-[#404E3F]"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Glossary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("formulas")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer",
              activeTab === "formulas"
                ? "bg-white text-[#404E3F] shadow-sm"
                : "text-[#404E3F]/50 hover:text-[#404E3F]"
            )}
          >
            <Calculator className="h-4 w-4" />
            Formulas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("symbols")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer",
              activeTab === "symbols"
                ? "bg-white text-[#404E3F] shadow-sm"
                : "text-[#404E3F]/50 hover:text-[#404E3F]"
            )}
          >
            <Tag className="h-4 w-4" />
            Market Symbols
          </button>
        </div>

        {/* Glossary tab */}
        {activeTab === "glossary" && (
          <div className="space-y-3">
            <GlossaryItem
              term="P/E Ratio (Price to Earnings)"
              definition="How much investors pay for every Rs. 1 of profit. If P/E is 15, people are paying Rs. 15 for each Rs. 1 the company earns. Lower can mean cheaper stock, higher can mean investors expect growth."
            />
            <GlossaryItem
              term="EPS (Earnings Per Share)"
              definition="The company's total profit divided by the number of shares. If a company earned Rs. 100 Crore and has 10 Crore shares, EPS is Rs. 10. Higher EPS = more profit per share you own."
            />
            <GlossaryItem
              term="Market Cap (Market Capitalization)"
              definition="The total value of all shares combined (share price x total shares). It tells you how big the company is. Large cap = big and stable, small cap = smaller and more volatile."
            />
            <GlossaryItem
              term="ROE (Return on Equity)"
              definition="How much profit a company makes from shareholders' money. If ROE is 20%, the company turns every Rs. 100 of equity into Rs. 20 profit. Higher ROE = better at using your money."
            />
            <GlossaryItem
              term="Dividend Yield"
              definition="The percentage return you get from dividends alone (without selling the stock). If a Rs. 100 stock pays Rs. 5 dividend, yield is 5%. Think of it like an interest rate on your investment."
            />
            <GlossaryItem
              term="LDCP (Last Day Closing Price)"
              definition="The price at which the stock closed on the previous trading day. Today's change is calculated from this price."
            />
            <GlossaryItem
              term="Volume"
              definition="How many shares were traded during the day. High volume means lots of people are buying and selling — the stock is active. Low volume means less interest."
            />
            <GlossaryItem
              term="52-Week High / Low"
              definition="The highest and lowest price the stock reached in the past one year. Helps you understand if the stock is near its peak or near its bottom."
            />
            <GlossaryItem
              term="Free Float"
              definition="The percentage of shares available for public trading (not held by promoters or locked). Higher free float = easier to buy/sell without affecting the price."
            />
            <GlossaryItem
              term="Circuit Breaker"
              definition="Price limits set by the exchange. If a stock hits the upper or lower circuit, trading is paused. It prevents extreme price swings in a single day."
            />
            <GlossaryItem
              term="Net Profit Margin"
              definition="Out of every Rs. 100 the company earns from sales, how much becomes actual profit after all expenses. A 25% margin means Rs. 25 profit from Rs. 100 revenue."
            />
            <GlossaryItem
              term="Book Value"
              definition="If the company sold everything and paid off all debts, what's left per share. If stock price is below book value, some investors consider it undervalued."
            />
            <GlossaryItem
              term="Shariah Compliant"
              definition="Stocks that meet Islamic finance screening criteria set by PSX. These are part of the KMI (KSE Meezan Index) All Shares index. The screening checks the company's business activities and financial ratios against Shariah guidelines."
            />
          </div>
        )}

        {/* Market Symbols tab */}
        {activeTab === "symbols" && (
          <div className="overflow-x-auto rounded-lg border border-[#E5E0D9]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F3F1E5]">
                  <th className="text-left p-3 font-semibold text-[#404E3F] w-24">
                    Symbol
                  </th>
                  <th className="text-left p-3 font-semibold text-[#404E3F]">
                    What It Means
                  </th>
                </tr>
              </thead>
              <tbody>
                {MARKET_SYMBOLS.map((s) => (
                  <tr
                    key={s.symbol}
                    className="border-t border-[#E5E0D9] hover:bg-[#F8F3EA]/50"
                  >
                    <td className="p-3">
                      <span className="inline-flex items-center rounded bg-[#2B5288]/10 px-2 py-0.5 text-xs font-bold text-[#2B5288]">
                        {s.symbol}
                      </span>
                    </td>
                    <td className="p-3 text-[#404E3F]/80">{s.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulas tab */}
        {activeTab === "formulas" && (
          <div className="space-y-4">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GlossaryItem({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#F8F3EA]">
      <h4 className="text-sm font-bold text-[#404E3F] mb-1">{term}</h4>
      <p className="text-sm text-[#404E3F]/80 leading-relaxed">{definition}</p>
    </div>
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
