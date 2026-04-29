import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "Intrinsic Value & Margin of Safety Explained (with Graham Number)";
const DESCRIPTION =
  "Learn what intrinsic value and margin of safety mean, how to calculate the Graham Number, and how to use them to spot undervalued PSX stocks. Simple English, real examples.";
const URL = "https://psxstocksanalyzer.com/learn/intrinsic-value-margin-of-safety";
const PUBLISHED = "2026-04-29";
const MODIFIED = "2026-04-29";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "article",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: { "@type": "Organization", name: "PSX Stock Analyzer" },
  publisher: {
    "@type": "Organization",
    name: "PSX Stock Analyzer",
    logo: { "@type": "ImageObject", url: "https://psxstocksanalyzer.com/og-img.png" },
  },
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  inLanguage: "en-PK",
  about: { "@type": "Thing", name: "Value Investing" },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F8F3EA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <article className="bg-white rounded-xl border border-[#E5E0D9] p-8 space-y-6">
          <nav className="text-xs text-[#404E3F]/60">
            <Link href="/learn" className="hover:underline">Learn</Link>
            <span className="mx-2">/</span>
            <span>Intrinsic Value &amp; Margin of Safety</span>
          </nav>

          <h1 className="text-2xl font-bold text-[#404E3F]">{TITLE}</h1>
          <p className="text-xs text-[#404E3F]/50">Updated April 2026 · 7 min read</p>

          <section className="space-y-3">
            <p className="text-sm text-[#404E3F]/80 leading-relaxed">
              <strong>Short answer:</strong> Intrinsic value is what a company is <em>actually</em> worth based on its earnings and assets. Margin of safety is the gap between that worth and the current market price. Buy only when the gap is wide enough to protect you from being wrong.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">What is intrinsic value?</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Intrinsic value is the &quot;real&quot; worth of a company based on hard numbers — its profits, assets, and ability to keep earning. It is independent of the daily share price.
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              The market price moves up and down every day because of news, sentiment, and emotions. Intrinsic value moves slowly because it depends on how much a business actually earns. This is the core idea behind <strong>value investing</strong>, popularised by Benjamin Graham in his 1949 book <em>The Intelligent Investor</em>, and later followed by Warren Buffett.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">What is the margin of safety?</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Margin of safety is the cushion between intrinsic value and the price you pay. It protects you when your estimate is off — and it almost always is, because the future is uncertain.
            </p>
            <div className="p-4 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]">
              <p className="text-sm text-[#404E3F] font-mono">
                Margin of Safety = (Intrinsic Value − Market Price) ÷ Intrinsic Value
              </p>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Graham himself recommended buying only when the margin of safety is at least <strong>30% to 50%</strong>. A bigger margin means a lower risk of permanent loss.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">The Graham Number — a simple way to estimate intrinsic value</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              There are many ways to calculate intrinsic value. The simplest one for beginners is the <strong>Graham Number</strong>, designed by Benjamin Graham as a maximum fair price for a defensive investor.
            </p>
            <div className="p-4 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]">
              <p className="text-sm text-[#404E3F] font-mono">
                Graham Number = √(22.5 × EPS × Book Value per Share)
              </p>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              The number 22.5 comes from Graham&apos;s rule of thumb: a stock should not trade above a P/E of 15 or a Price-to-Book of 1.5. Multiplying these gives 22.5.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">A worked example</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Imagine a PSX-listed company with:
            </p>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>EPS:</strong> Rs. 15</li>
              <li><strong>Book Value per Share:</strong> Rs. 100</li>
              <li><strong>Current Market Price:</strong> Rs. 80</li>
            </ul>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Step 1 — Calculate the Graham Number:
            </p>
            <div className="p-4 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9] space-y-1">
              <p className="text-sm text-[#404E3F] font-mono">
                Graham Number = √(22.5 × 15 × 100)
              </p>
              <p className="text-sm text-[#404E3F] font-mono">
                = √33,750 ≈ Rs. 183.71
              </p>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Step 2 — Margin of safety:
            </p>
            <div className="p-4 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9] space-y-1">
              <p className="text-sm text-[#404E3F] font-mono">
                Margin = (183.71 − 80) ÷ 183.71 ≈ 56%
              </p>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              The stock trades at Rs. 80 but its Graham Number is Rs. 183.71 — a 56% buffer. That is well above Graham&apos;s recommended 30%–50% range, so the stock would be classified as <strong>undervalued</strong> on this measure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">How to read the result</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#404E3F]/80">
                <thead>
                  <tr className="border-b border-[#E5E0D9]">
                    <th className="text-left py-2 pr-4 font-semibold">Margin of Safety</th>
                    <th className="text-left py-2 font-semibold">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#E5E0D9]">
                    <td className="py-2 pr-4 font-mono">≥ 30%</td>
                    <td className="py-2"><span className="text-[#4BC232] font-semibold">Undervalued</span> — strong buffer</td>
                  </tr>
                  <tr className="border-b border-[#E5E0D9]">
                    <td className="py-2 pr-4 font-mono">0% – 30%</td>
                    <td className="py-2"><span className="text-amber-600 font-semibold">Fairly priced</span> — small buffer</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">Negative</td>
                    <td className="py-2"><span className="text-red-500 font-semibold">Overvalued</span> — paying more than fair</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">When the Graham Number does not work</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Loss-making companies:</strong> if EPS is zero or negative, the formula breaks</li>
              <li><strong>Negative book value:</strong> companies with more debt than assets</li>
              <li><strong>Asset-light businesses:</strong> tech and software companies often have very low book value, making the Graham Number understate fair worth</li>
              <li><strong>Very high growth companies:</strong> the formula was built for stable, mature businesses, not fast growers</li>
              <li><strong>One-off profits:</strong> if EPS is inflated by a tax refund or land sale, the result will be misleading</li>
            </ul>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              For PSX, the Graham Number works best on cement, banks, fertiliser, and other mature companies with steady profits and real physical assets. Treat the result as one input among many — never the only reason to buy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Other ways to estimate intrinsic value</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Discounted Cash Flow (DCF):</strong> projects a company&apos;s future cash flows and discounts them back to today. More accurate but harder.</li>
              <li><strong>Dividend Discount Model:</strong> works well for steady dividend payers</li>
              <li><strong>Earnings Power Value:</strong> based on sustainable earnings divided by the required return</li>
              <li><strong>Asset-based valuation:</strong> useful for asset-heavy businesses or in liquidation scenarios</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Why margin of safety matters more than the formula</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              No formula gives you the exact intrinsic value of a company — every estimate is an opinion based on the numbers and assumptions you use. The margin of safety exists because <em>you can be wrong</em>. As Warren Buffett puts it, &quot;Margin of safety is the three most important words in investing.&quot;
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              A 40% margin of safety means even if your intrinsic value estimate is off by 20%, you still come out ahead. Without it, you are paying full price for your assumptions — and assumptions can be wrong.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Check any PSX stock&apos;s value in one click</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              <Link href="/" className="text-[#2B5288] underline">PSX Stock Analyzer</Link>
              {" "}automatically calculates the Graham Number and margin of safety for any profitable PSX-listed company. Just paste the company&apos;s PSX URL and you&apos;ll see whether the stock is undervalued, fairly priced, or overvalued — all explained in plain English.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Sources &amp; further reading</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li>Benjamin Graham, <em>The Intelligent Investor</em> (1949) — the original book that defined value investing and the margin of safety concept</li>
              <li>Benjamin Graham &amp; David Dodd, <em>Security Analysis</em> (1934)</li>
              <li>
                <a href="https://www.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Pakistan Stock Exchange (psx.com.pk)
                </a>
              </li>
              <li>
                <a href="https://www.berkshirehathaway.com/letters/letters.html" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Warren Buffett&apos;s Berkshire Hathaway Shareholder Letters
                </a>
                {" "}— annual letters discussing valuation and margin of safety
              </li>
            </ul>
          </section>

          <div className="p-4 rounded-xl bg-[#4BC232]/10 border border-[#4BC232]/20">
            <p className="text-sm text-[#404E3F] text-center leading-relaxed">
              See the Graham Number for any PSX stock —{" "}
              <Link href="/" className="text-[#2B5288] underline font-medium">analyze a stock for free</Link>.
            </p>
          </div>

          <p className="text-xs text-[#404E3F]/50 border-t border-[#E5E0D9] pt-4">
            This article is for educational purposes only and is not financial advice. The Graham Number is one of many valuation tools and should not be used in isolation. Always do your own research and consult a licensed financial adviser before investing.
          </p>
        </article>
      </main>
    </div>
  );
}
