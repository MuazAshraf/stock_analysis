import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn — PSX Investing Guides for Beginners",
  description:
    "Free guides on how to invest in the Pakistan Stock Exchange (PSX). Learn about P/E ratio, Shariah-compliant stocks, KSE-100 index, and how to open a brokerage account — all in simple English.",
  alternates: { canonical: "https://psxstocksanalyzer.com/learn" },
  openGraph: {
    title: "Learn PSX Investing — Free Guides for Beginners",
    description:
      "Step-by-step guides on Pakistan Stock Exchange investing for beginners. P/E ratio, Shariah screening, opening a brokerage account, and more.",
    url: "https://psxstocksanalyzer.com/learn",
    type: "website",
  },
};

const ARTICLES = [
  {
    slug: "how-to-start-investing-in-psx",
    title: "How to Start Investing in the Pakistan Stock Exchange (PSX)",
    desc: "A complete step-by-step guide for beginners — from opening a brokerage account to buying your first share on PSX.",
    read: "8 min read",
  },
  {
    slug: "pe-ratio-explained",
    title: "P/E Ratio Explained: How to Use It for PSX Stocks",
    desc: "Learn what the Price-to-Earnings ratio means, how to calculate it, and how to use it to compare Pakistani stocks.",
    read: "6 min read",
  },
  {
    slug: "shariah-compliant-stocks-psx",
    title: "Shariah-Compliant Stocks on PSX: The KMI Index Explained",
    desc: "What makes a stock Shariah-compliant in Pakistan? Understand the KMI-30 index, screening rules, and how to invest Islamically.",
    read: "7 min read",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#F8F3EA]">
      <header className="bg-white border-b border-[#E5E0D9] py-4">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="text-lg font-bold text-[#404E3F] hover:text-[#4BC232] transition-colors">
            PSX Stock Analyzer
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-[#E5E0D9] p-8 space-y-8">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-[#4BC232] mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-[#404E3F]">Learn PSX Investing</h1>
              <p className="text-sm text-[#404E3F]/60 mt-2 leading-relaxed">
                Free, beginner-friendly guides on investing in the Pakistan Stock Exchange. No finance degree needed — everything explained in plain, simple English.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/learn/${a.slug}`}
                className="block p-5 rounded-xl bg-[#F8F3EA] hover:bg-[#4BC232]/10 transition-colors border border-transparent hover:border-[#4BC232]/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-[#404E3F]">{a.title}</h2>
                    <p className="text-sm text-[#404E3F]/70 mt-1 leading-relaxed">{a.desc}</p>
                    <p className="text-xs text-[#404E3F]/50 mt-2">{a.read}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#4BC232] mt-1 flex-shrink-0" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#4BC232]/10 border border-[#4BC232]/20">
            <p className="text-sm text-[#404E3F] text-center leading-relaxed">
              Ready to analyze a stock?{" "}
              <Link href="/" className="text-[#2B5288] underline font-medium">
                Start here
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E5E0D9] mt-16 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-[#404E3F]/40">
            For educational purposes only. Not financial advice.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="text-xs text-[#2B5288] hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-[#2B5288] hover:underline">Terms of Service</Link>
            <Link href="/about" className="text-xs text-[#2B5288] hover:underline">About</Link>
            <Link href="/faq" className="text-xs text-[#2B5288] hover:underline">FAQ</Link>
            <Link href="/contact" className="text-xs text-[#2B5288] hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
