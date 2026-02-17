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
import { HealthCheck } from "@/components/sections/health-check";
import { DividendCheck } from "@/components/sections/dividend-check";
import { FinalVerdict } from "@/components/sections/final-verdict";
import { Formulas } from "@/components/sections/formulas";
import { MarketTicker } from "@/components/sections/market-ticker";
import { ComparisonView } from "@/components/sections/comparison-view";
import {
  AlertCircle,
  BarChart3,
  TrendingUp,
  ArrowLeftRight,
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
      {/* Header */}
      <header className="bg-white border-b border-[#E5E0D9] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#4BC232] flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#404E3F] leading-tight">
                PSX Stock Analyzer
              </h1>
              <p className="text-xs text-[#404E3F]/50">
                Pakistan Stock Exchange - Simple Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero section when idle on either tab */}
        {((activeTab === "analyze" && isAnalyzeIdle) ||
          (activeTab === "compare" && isCompareIdle)) && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#4BC232]/10 text-[#4BC232] rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              Free Stock Analysis for Pakistani Investors
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#404E3F] mb-3">
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
            </h2>
            <p className="text-[#404E3F]/60 max-w-lg mx-auto mb-8">
              {activeTab === "analyze"
                ? "New to investing? Paste any Pakistan Stock Exchange company link and get a clear, jargon-free analysis that anyone can understand."
                : "Paste two PSX stock URLs and see a head-to-head comparison of key financial metrics to help you decide."}
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
                />
                <TradingInfo price={data.price} />
                {data.financials_annual &&
                  data.financials_annual.length > 0 && (
                    <MoneyTalk financials={data.financials_annual} />
                  )}
                {data.ratios && (
                  <HealthCheck price={data.price} ratios={data.ratios} />
                )}
                <DividendCheck
                  payouts={data.payouts || []}
                  dividendStatus={data.analysis?.dividend_status || ""}
                />
                {data.analysis && <FinalVerdict analysis={data.analysis} />}
                <Formulas />
              </div>
            )}

            {/* Empty state hint */}
            {isAnalyzeIdle && (
              <div className="text-center mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <StepCard
                    step="1"
                    title="Paste a PSX URL"
                    description="Go to dps.psx.com.pk, find any company, and copy the URL"
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

            {/* Empty state hint */}
            {isCompareIdle && (
              <div className="text-center mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <StepCard
                    step="1"
                    title="Paste Two PSX URLs"
                    description="Find two companies on dps.psx.com.pk and copy both URLs"
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
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E0D9] mt-16 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-[#404E3F]/40">
            For educational purposes only. Not financial advice. Always do your
            own research before investing.
          </p>
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
