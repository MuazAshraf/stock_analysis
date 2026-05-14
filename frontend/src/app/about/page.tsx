import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Shield, FileText, BookOpen, ArrowLeftRight, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About PSX Stock Analyzer — a free stock analysis tool built for Pakistani investors who want to understand PSX stocks in plain English.",
  alternates: { canonical: "https://psxstocksanalyzer.com/about" },
};

const FEATURES = [
  { icon: TrendingUp, title: "Stock Analysis", desc: "Get a complete breakdown of any PSX-listed company — price, financials, dividends, and a plain English verdict." },
  { icon: ArrowLeftRight, title: "Stock Comparison", desc: "Compare two stocks head-to-head across 7 key metrics with a clear winner and explanation." },
  { icon: Shield, title: "Shariah Compliance", desc: "Instantly see if a stock is in the KMI All Shares Islamic index with a green Shariah Compliant badge." },
  { icon: FileText, title: "Financial Statements", desc: "View Income Statement, Balance Sheet, and Cash Flow data with annual and quarterly breakdowns." },
  { icon: BarChart3, title: "Price Charts", desc: "1-year price history chart showing the stock's performance trend at a glance." },
  { icon: BookOpen, title: "Education", desc: "Glossary, formulas, market symbols — all explained in plain English with a Roman Urdu toggle." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-brand-card rounded-xl border border-brand-border p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-fg">About PSX Stock Analyzer</h1>
            <p className="text-sm text-brand-fg/60 mt-2 leading-relaxed">
              PSX Stock Analyzer is a free stock analysis tool for the Pakistan Stock Exchange (PSX) that explains stocks in plain English for beginner Pakistani investors.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-brand-fg">Our Mission</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              PSX Stock Analyzer is a free tool built for Pakistani investors who find stock analysis
              intimidating. We believe everyone deserves to understand where their money is going —
              without needing a finance degree.
            </p>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              We translate complex financial jargon into plain, simple English that anyone can
              understand. Whether you&apos;re looking at your first stock or comparing two companies,
              our tool gives you clear, honest analysis with no hidden agenda.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-brand-fg">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3 p-4 rounded-xl bg-brand-bg">
                  <f.icon className="h-5 w-5 text-[#4BC232] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-brand-fg">{f.title}</h3>
                    <p className="text-xs text-brand-fg/60 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-brand-fg">Where Our Data Comes From</h2>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-brand-bg">
                <p className="text-sm text-brand-fg">
                  <strong>PSX Data Portal</strong> (dps.psx.com.pk) — Live stock prices, company profiles,
                  trading data, dividend history, and index constituents.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-brand-bg">
                <p className="text-sm text-brand-fg">
                  <strong>Yahoo Finance</strong> — Financial statements (Income Statement, Balance Sheet,
                  Cash Flow), price history charts, and book value data.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#4BC232]/10 border border-[#4BC232]/20">
            <p className="text-sm text-brand-fg text-center leading-relaxed">
              Built with passion for making Pakistan&apos;s stock market accessible to everyone.
              <br />
              <span className="text-[#4BC232] font-semibold">100% free. No sign-up. No hidden fees.</span>
            </p>
          </div>

          <div className="text-sm text-brand-fg/50 text-center">
            <p>
              PSX Stock Analyzer is an educational tool only. We do not provide financial advice.
              <br />
              Please read our{" "}
              <Link href="/terms" className="text-[#2B5288] underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-[#2B5288] underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
