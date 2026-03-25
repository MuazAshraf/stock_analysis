import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = {
  title:
    "PSX Stock Analyzer - Free Pakistan Stock Exchange Analysis for Beginners",
  description:
    "Free PSX stock analysis tool for Pakistani investors. Analyze any KSE 100 company in plain English — P/E ratio, dividends, Shariah compliance, financials & more. No finance degree needed.",
  alternates: {
    canonical: "https://psxstocksanalyzer.com/",
  },
};

export default function Home() {
  return <Dashboard />;
}
