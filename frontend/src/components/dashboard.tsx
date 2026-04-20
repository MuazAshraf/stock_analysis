"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeStock, compareStocks } from "@/lib/api";
import type { StockData, CompareResponse } from "@/types/stock";
import { SearchBar } from "@/components/search-bar";
import { CompareSearch } from "@/components/compare-search";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { ComparisonLoadingSkeleton } from "@/components/comparison-loading-skeleton";
import { CompanyOverview } from "@/components/sections/company-overview";
import { TradingInfo } from "@/components/sections/trading-info";
import { MoneyTalk } from "@/components/sections/money-talk";
import { DividendCheck } from "@/components/sections/dividend-check";
import { FinalVerdict } from "@/components/sections/final-verdict";
import { Formulas } from "@/components/sections/formulas";
import { MarketTicker } from "@/components/sections/market-ticker";
import { ComparisonView } from "@/components/sections/comparison-view";
import { PriceChart } from "@/components/sections/price-chart";
import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  TrendingUp,
  ArrowLeftRight,
  MessageSquare,
} from "lucide-react";

type Tab = "analyze" | "compare";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");
  const [data, setData] = useState<StockData | null>(null);
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: analyzeStock,
    onSuccess: (result) => {
      setData(result);
    },
  });

  const compareMutation = useMutation({
    mutationFn: ({ urlA, urlB }: { urlA: string; urlB: string }) =>
      compareStocks(urlA, urlB),
    onSuccess: (result) => {
      setCompareData(result);
    },
  });

  function handleAnalyze(url: string) {
    setData(null);
    analyzeMutation.mutate(url);
  }

  function handleCompare(urlA: string, urlB: string) {
    setCompareData(null);
    compareMutation.mutate({ urlA, urlB });
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
  }

  const isAnalyzeIdle =
    !data && !analyzeMutation.isPending && !analyzeMutation.isError;
  const isCompareIdle =
    !compareData && !compareMutation.isPending && !compareMutation.isError;

  return (
    <div className="min-h-screen bg-[#F8F3EA]">
      <main
        className="max-w-5xl mx-auto px-4 py-8"
        aria-label="PSX Stock Analyzer — Free Pakistan Stock Exchange analysis tool"
      >
        {/* Hero section when idle on either tab */}
        {((activeTab === "analyze" && isAnalyzeIdle) ||
          (activeTab === "compare" && isCompareIdle)) && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#4BC232]/10 text-[#4BC232] rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              Free Stock Analysis for Pakistani Investors
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#404E3F] mb-3"
              aria-label={
                activeTab === "analyze"
                  ? "Understand Any PSX Stock in Plain English — Free Pakistan Stock Exchange Analysis"
                  : "Compare Two PSX Stocks Side by Side — Free KSE 100 Stock Comparison Tool"
              }
            >
              {activeTab === "analyze" ? (
                <>
                  Understand Any PSX Stock
                  <br />
                  <span className="text-[#4BC232]">in Plain English</span>
                </>
              ) : (
                <>
                  Compare Two PSX Stocks
                  <br />
                  <span className="text-[#4BC232]">Side by Side</span>
                </>
              )}
            </h1>
            <p className="text-[#404E3F]/60 max-w-lg mx-auto mb-8">
              {activeTab === "analyze"
                ? "New to investing? Pick any Pakistan Stock Exchange (PSX) company and get a clear, jargon-free KSE stock analysis that anyone can understand."
                : "Pick two PSX stocks and see a head-to-head comparison of key financial metrics to help you decide."}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white rounded-xl border border-[#E5E0D9] p-1">
            <button
              onClick={() => handleTabChange("analyze")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "analyze"
                  ? "bg-[#F8F3EA] text-[#404E3F] border-b-2 border-[#4BC232]"
                  : "text-[#404E3F]/50 hover:text-[#404E3F]/80"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Analyze a Stock
            </button>
            <button
              onClick={() => handleTabChange("compare")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "compare"
                  ? "bg-[#F8F3EA] text-[#404E3F] border-b-2 border-[#4BC232]"
                  : "text-[#404E3F]/50 hover:text-[#404E3F]/80"
              }`}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Compare Two Stocks
            </button>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-[#404E3F]/50 hover:text-[#404E3F]/80"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Link>
          </div>
        </div>

        {/* Search area */}
        <div className="mb-8">
          {activeTab === "analyze" ? (
            <SearchBar
              onAnalyze={handleAnalyze}
              isLoading={analyzeMutation.isPending}
            />
          ) : (
            <CompareSearch
              onCompare={handleCompare}
              isLoading={compareMutation.isPending}
            />
          )}
        </div>

        {/* === ANALYZE TAB CONTENT === */}
        {activeTab === "analyze" && (
          <>
            {/* Error state */}
            {analyzeMutation.isError && (
              <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Analysis Failed
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    {analyzeMutation.error instanceof Error
                      ? analyzeMutation.error.message
                      : "Something went wrong. Please check the URL and try again."}
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {analyzeMutation.isPending && (
              <div className="mb-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-[#404E3F]/60">
                    Scraping data from PSX and analyzing... This may take a
                    moment.
                  </p>
                </div>
                <LoadingSkeleton />
              </div>
            )}

            {/* Results */}
            {data && !analyzeMutation.isPending && (
              <div className="space-y-6">
                {data.indices && data.indices.length > 0 && (
                  <MarketTicker indices={data.indices} />
                )}
                <CompanyOverview
                  company={data.company}
                  price={data.price}
                  equity={data.equity}
                  isShariah={data.is_shariah}
                  bookValue={data.book_value}
                />
                {data.price_history && data.price_history.length > 0 && (
                  <PriceChart
                    data={data.price_history}
                    symbol={data.company.symbol}
                  />
                )}
                <TradingInfo
                  price={data.price}
                  ratios={data.ratios}
                />
                {data.financials_annual &&
                  data.financials_annual.length > 0 && (
                    <MoneyTalk financials={data.financials_annual} />
                  )}
                <DividendCheck
                  payouts={data.payouts || []}
                  dividendStatus={data.analysis?.dividend_status || ""}
                />
                {data.analysis && <FinalVerdict analysis={data.analysis} />}
                <Formulas statements={data.statements} />
              </div>
            )}

            {/* Idle state: steps + educational content */}
            {isAnalyzeIdle && (
              <div className="mt-12 space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <StepCard
                    step="1"
                    title="Pick a Stock"
                    description="Search and select any PSX-listed company from the dropdown"
                  />
                  <StepCard
                    step="2"
                    title="Click Analyze"
                    description="We'll scrape the latest data and crunch the numbers"
                  />
                  <StepCard
                    step="3"
                    title="Read the Results"
                    description="Get a clear, simple analysis anyone can understand"
                  />
                </div>

                {/* What You Get section */}
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-lg font-bold text-[#404E3F] text-center mb-4">
                    What You Get With Every Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Company Overview", desc: "Company name, sector, CEO, market cap, 52-week price range, and current trading data." },
                      { title: "Financial Statements", desc: "Income Statement, Balance Sheet, and Cash Flow highlights with annual and quarterly views." },
                      { title: "Health Check", desc: "P/E ratio gauge, profit margins, EPS growth trends, and key financial ratios at a glance." },
                      { title: "Dividend History", desc: "Complete payout history with dates, amounts, and book closure details from PSX records." },
                      { title: "Shariah Compliance", desc: "Instant badge showing whether the stock is in the KMI All Shares Islamic index." },
                      { title: "Final Verdict", desc: "Plain English summary with business verdict, risk level, and actionable insights for beginners." },
                    ].map((item) => (
                      <div key={item.title} className="p-4 rounded-xl bg-white border border-[#E5E0D9]">
                        <h4 className="text-sm font-semibold text-[#404E3F] mb-1">{item.title}</h4>
                        <p className="text-xs text-[#404E3F]/60 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ section */}
                <section
                  className="max-w-3xl mx-auto"
                  aria-label="Frequently Asked Questions about PSX Stock Analyzer"
                  itemScope
                  itemType="https://schema.org/FAQPage"
                >
                  <h3 className="text-lg font-bold text-[#404E3F] text-center mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {[
                      { q: "What is the Pakistan Stock Exchange (PSX)?", a: "PSX is the national stock exchange of Pakistan, located in Karachi. It lists over 500 companies across sectors like banking, cement, oil & gas, fertilizer, and technology. The KSE-100 index tracks the top 100 companies by market capitalization." },
                      { q: "Do I need a finance degree to use this tool?", a: "Not at all! This tool is built specifically for beginners. Every metric is explained in plain English. We translate complex financial jargon into simple, easy-to-understand language so anyone can make informed decisions." },
                      { q: "Where does the data come from?", a: "Stock prices and company data come directly from the PSX Data Portal (dps.psx.com.pk). Financial statements (Income Statement, Balance Sheet, Cash Flow) are sourced from Yahoo Finance. Shariah compliance is checked against the KMI All Shares index." },
                      { q: "Is this financial advice?", a: "No. This tool is for educational purposes only. It provides data and analysis to help you understand stocks, but you should always do your own research and consult a qualified financial advisor before investing." },
                      { q: "What does Shariah Compliant mean?", a: "Stocks that meet Islamic finance screening criteria are part of the KMI (KSE Meezan Index) All Shares index. PSX screens companies based on their business activities and financial ratios against Shariah guidelines. Look for the green Shariah Compliant badge on qualifying stocks." },
                      { q: "How often is the data updated?", a: "Stock prices and trading data are fetched live from PSX each time you analyze a stock. Financial statements update quarterly or annually based on company filings. The stock list is cached for 1 hour." },
                      { q: "Can I compare two PSX stocks against each other?", a: "Yes! Use the Compare tab to run a side-by-side comparison of any two PSX-listed companies. The tool scores each stock across 7 key metrics — P/E ratio, profit margin, EPS growth, dividend yield, market cap, revenue growth, and risk level — and declares an overall winner." },
                      { q: "Is the PSX Stock Analyzer free to use?", a: "Yes, PSX Stock Analyzer is completely free to use. There are no subscriptions, no sign-ups, and no hidden fees. Simply search for any PSX-listed company and get instant analysis." },
                    ].map((faq) => (
                      <div
                        key={faq.q}
                        className="p-4 rounded-xl bg-white border border-[#E5E0D9]"
                        itemScope
                        itemProp="mainEntity"
                        itemType="https://schema.org/Question"
                      >
                        <h4
                          className="text-sm font-semibold text-[#404E3F] mb-1"
                          itemProp="name"
                        >
                          {faq.q}
                        </h4>
                        <div
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <p
                            className="text-xs text-[#404E3F]/60 leading-relaxed"
                            itemProp="text"
                          >
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        {/* === COMPARE TAB CONTENT === */}
        {activeTab === "compare" && (
          <>
            {/* Error state */}
            {compareMutation.isError && (
              <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Comparison Failed
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    {compareMutation.error instanceof Error
                      ? compareMutation.error.message
                      : "Something went wrong. Please check the URLs and try again."}
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {compareMutation.isPending && (
              <div className="mb-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-[#404E3F]/60">
                    Scraping data from PSX and comparing both stocks... This may
                    take a moment.
                  </p>
                </div>
                <ComparisonLoadingSkeleton />
              </div>
            )}

            {/* Results */}
            {compareData && !compareMutation.isPending && (
              <ComparisonView data={compareData} />
            )}

            {/* Idle state: steps + content */}
            {isCompareIdle && (
              <div className="mt-12 space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <StepCard
                    step="1"
                    title="Pick Two Stocks"
                    description="Search and select two PSX-listed companies from the dropdowns"
                  />
                  <StepCard
                    step="2"
                    title="Click Compare"
                    description="We'll fetch both stocks and run a head-to-head analysis"
                  />
                  <StepCard
                    step="3"
                    title="See the Winner"
                    description="Get a clear comparison with scores and a final verdict"
                  />
                </div>

                <div className="max-w-3xl mx-auto">
                  <h3 className="text-lg font-bold text-[#404E3F] text-center mb-4">
                    How the Comparison Works
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "7 Key Metrics", desc: "We compare stocks across P/E ratio, profit margin, EPS growth, dividend yield, market cap, revenue growth, and risk level." },
                      { title: "Head-to-Head Scoring", desc: "Each metric has a winner. The stock that wins more metrics gets the overall edge, with a clear final verdict." },
                      { title: "Plain English Explanations", desc: "Every metric comparison includes a simple explanation of what the numbers mean and why one stock scored better." },
                      { title: "Same Sector or Different", desc: "Compare stocks within the same sector (e.g., two cement companies) or across sectors to find the best opportunity." },
                    ].map((item) => (
                      <div key={item.title} className="p-4 rounded-xl bg-white border border-[#E5E0D9]">
                        <h4 className="text-sm font-semibold text-[#404E3F] mb-1">{item.title}</h4>
                        <p className="text-xs text-[#404E3F]/60 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        className="border-t border-[#E5E0D9] mt-16 py-6"
        aria-label="Site footer"
        itemScope
        itemType="https://schema.org/WPFooter"
      >
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-[#404E3F]/60 font-medium">
            PSX Stock Analyzer &mdash; Free Pakistan Stock Exchange (PSX) &amp; KSE 100 Analysis Tool
          </p>
          <p className="text-xs text-[#404E3F]/40">
            For educational purposes only. Not financial advice. Always do your
            own research before investing in PSX-listed companies.
          </p>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-1"
          >
            <span className="text-xs text-[#404E3F]/30">PSX Analysis</span>
            <span className="text-xs text-[#404E3F]/30">KSE 100 Stocks</span>
            <span className="text-xs text-[#404E3F]/30">Shariah Compliant Stocks</span>
            <span className="text-xs text-[#404E3F]/30">Dividend Stocks Pakistan</span>
            <span className="text-xs text-[#404E3F]/30">Pakistan Stock Market</span>
          </nav>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2">
            <Link href="/privacy" className="text-xs font-medium text-[#404E3F]/50 hover:text-[#4BC232] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs font-medium text-[#404E3F]/50 hover:text-[#4BC232] transition-colors">Terms of Service</Link>
            <Link href="/about" className="text-xs font-medium text-[#404E3F]/50 hover:text-[#4BC232] transition-colors">About</Link>
            <Link href="/faq" className="text-xs font-medium text-[#404E3F]/50 hover:text-[#4BC232] transition-colors">FAQ</Link>
            <Link href="/contact" className="text-xs font-medium text-[#404E3F]/50 hover:text-[#4BC232] transition-colors">Contact</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-3">
            <a href="https://dps.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#2B5288] hover:text-[#4BC232] transition-colors underline underline-offset-2">PSX Data Portal</a>
            <a href="https://www.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#2B5288] hover:text-[#4BC232] transition-colors underline underline-offset-2">Pakistan Stock Exchange</a>
            <a href="https://www.secp.gov.pk" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#2B5288] hover:text-[#4BC232] transition-colors underline underline-offset-2">SECP</a>
            <a href="https://www.tradingview.com/markets/stocks-pakistan/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#2B5288] hover:text-[#4BC232] transition-colors underline underline-offset-2">TradingView</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white border border-[#E5E0D9] text-center">
      <div className="w-8 h-8 rounded-full bg-[#4BC232] text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">
        {step}
      </div>
      <h3 className="text-sm font-semibold text-[#404E3F] mb-1">{title}</h3>
      <p className="text-xs text-[#404E3F]/60">{description}</p>
    </div>
  );
}
