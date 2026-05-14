import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "Shariah-Compliant Stocks on PSX: The KMI Index Explained";
const DESCRIPTION =
  "What makes a stock Shariah-compliant on the Pakistan Stock Exchange? Learn about the KMI-30 and KMI All Shares Islamic index, screening rules, and how to invest Islamically in PSX.";
const URL = "https://psxstocksanalyzer.com/learn/shariah-compliant-stocks-psx";
const PUBLISHED = "2026-04-20";
const MODIFIED = "2026-04-20";

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
  about: { "@type": "Thing", name: "Shariah-compliant investing" },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <article className="bg-brand-card rounded-xl border border-brand-border p-8 space-y-6">
          <nav className="text-xs text-brand-fg/60">
            <Link href="/learn" className="hover:underline">Learn</Link>
            <span className="mx-2">/</span>
            <span>Shariah-Compliant Stocks on PSX</span>
          </nav>

          <h1 className="text-2xl font-bold text-brand-fg">{TITLE}</h1>
          <p className="text-xs text-brand-fg/50">Updated April 2026 · 7 min read</p>

          <section className="space-y-3">
            <p className="text-sm text-brand-fg/80 leading-relaxed">
              <strong>Short answer:</strong> A Shariah-compliant stock is a company that follows Islamic rules in both its business activities and its finances. On PSX, these stocks are part of the KMI-30 index or the broader KMI All Shares Islamic Index. Companies must pass a two-part test — one on what they do, and one on their balance sheet numbers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">What is the KMI-30 Index?</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              The <strong>KMI-30 (KSE Meezan Index 30)</strong> is the flagship Shariah-compliant stock index of the Pakistan Stock Exchange. It tracks the 30 largest and most liquid Shariah-compliant companies listed on PSX.
            </p>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              The index was launched in September 2008 as a joint initiative of <strong>Al Meezan Investment Management</strong> (Pakistan&apos;s largest Shariah-compliant asset manager) and the Karachi Stock Exchange (now PSX). Al Meezan acts as the Shariah adviser and reviews the index constituents regularly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">KMI-30 vs KMI All Shares Index</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              There are two main Islamic indices on PSX:
            </p>
            <ul className="text-sm text-brand-fg/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>KMI-30:</strong> Only the 30 largest Shariah-compliant stocks by free-float market capitalization. Used as a benchmark for Islamic funds.</li>
              <li><strong>KMI All Shares Index:</strong> A much broader index that includes every Shariah-compliant stock listed on PSX, no matter the size.</li>
            </ul>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              If a stock is in either index, it is considered Shariah-compliant. PSX Stock Analyzer shows a green <strong>Shariah Compliant</strong> badge on any stock that qualifies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">The two-part Shariah screening</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              To be called Shariah-compliant, a PSX company has to pass two types of checks:
            </p>
            <ol className="text-sm text-brand-fg/70 leading-relaxed list-decimal pl-5 space-y-1">
              <li><strong>Business activity screening</strong> — what does the company do?</li>
              <li><strong>Financial ratio screening</strong> — how is the balance sheet structured?</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">1. Business activity screening</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              A company is rejected if its main business is in any of these areas:
            </p>
            <ul className="text-sm text-brand-fg/70 leading-relaxed list-disc pl-5 space-y-1">
              <li>Conventional (interest-based) banking and financial services</li>
              <li>Conventional insurance (non-Takaful)</li>
              <li>Alcohol, tobacco, and pork-based products</li>
              <li>Gambling, casinos, and lotteries</li>
              <li>Adult entertainment and pornography</li>
              <li>Weapons and arms manufacturing for offensive use</li>
              <li>Advertising and media that promotes non-Shariah content</li>
            </ul>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              In short: if the core business clearly goes against Islamic principles, the company is not eligible.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">2. Financial ratio screening</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              Even if the business is halal, the company&apos;s balance sheet must also pass certain financial tests. The commonly used criteria (based on Al Meezan&apos;s methodology, which follows AAOIFI Shariah standards) cover:
            </p>
            <ul className="text-sm text-brand-fg/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Interest-bearing debt</strong> should be a small share of total assets</li>
              <li><strong>Non-compliant investments</strong> (like in conventional bonds) should be limited</li>
              <li><strong>Income from non-compliant sources</strong> (like interest on bank deposits) should be a very small part of total revenue</li>
              <li><strong>Illiquid assets</strong> (factories, inventory, property) should make up at least a minimum portion of total assets</li>
              <li><strong>Market price per share</strong> should not be below the company&apos;s net liquid assets per share</li>
            </ul>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              The exact percentage thresholds are updated from time to time by Shariah scholars. Always check the latest criteria on the{" "}
              <a href="https://www.almeezangroup.com" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">Al Meezan Investment Management</a>
              {" "}website or the official{" "}
              <a href="https://www.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">PSX</a>
              {" "}index methodology document.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">What about small non-compliant income?</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              A company can still be Shariah-compliant even if a very small part of its income comes from non-compliant sources — for example, a manufacturer that earns a tiny amount of interest on its bank deposits. But that small amount must be below the allowed threshold, and investors are advised to give that portion of their dividends to charity. This process is called <strong>purification</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">How often is the list reviewed?</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              KMI index constituents are re-checked every six months. A company that no longer passes the screening is removed, and new eligible companies are added. This is why a stock&apos;s Shariah status can change over time — always check before you buy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">How to invest Islamically on PSX</h2>
            <ul className="text-sm text-brand-fg/70 leading-relaxed list-disc pl-5 space-y-1">
              <li>Buy individual Shariah-compliant stocks through a normal broker account</li>
              <li>Invest in Shariah-compliant mutual funds (for example, funds managed by Al Meezan, NAFA Islamic, UBL Islamic, or ABL Islamic)</li>
              <li>Choose Islamic pension plans (VPS — Voluntary Pension Scheme Islamic)</li>
              <li>Use Islamic ETFs where available</li>
            </ul>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              If you prefer individual stocks, always verify the current Shariah status before buying. A stock that was compliant last year may not be compliant this year if its debt or business mix has changed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">Check Shariah status in one click</h2>
            <p className="text-sm text-brand-fg/70 leading-relaxed">
              <Link href="/" className="text-[#2B5288] underline">PSX Stock Analyzer</Link>
              {" "}automatically shows a green Shariah Compliant badge on any stock that is part of the KMI All Shares Islamic index. Just paste a PSX company URL and you&apos;ll see the Shariah status along with the full financial analysis — free, no sign-up.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-brand-fg">Sources &amp; further reading</h2>
            <ul className="text-sm text-brand-fg/70 leading-relaxed list-disc pl-5 space-y-1">
              <li>
                <a href="https://www.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Pakistan Stock Exchange (psx.com.pk)
                </a>
              </li>
              <li>
                <a href="https://www.almeezangroup.com" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Al Meezan Investment Management (almeezangroup.com)
                </a>
              </li>
              <li>
                <a href="https://aaoifi.com" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  AAOIFI — Accounting and Auditing Organization for Islamic Financial Institutions
                </a>
              </li>
              <li>
                <a href="https://www.secp.gov.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Securities and Exchange Commission of Pakistan (secp.gov.pk)
                </a>
              </li>
            </ul>
          </section>

          <div className="p-4 rounded-xl bg-[#4BC232]/10 border border-[#4BC232]/20">
            <p className="text-sm text-brand-fg text-center leading-relaxed">
              Check if any PSX stock is Shariah-compliant in one click —{" "}
              <Link href="/" className="text-[#2B5288] underline font-medium">analyze a stock for free</Link>.
            </p>
          </div>

          <p className="text-xs text-brand-fg/50 border-t border-brand-border pt-4">
            This article is for educational purposes only and is not financial or religious advice. Shariah compliance status can change — always verify with a qualified scholar or the official Al Meezan / PSX sources before investing.
          </p>
        </article>
      </main>

    </div>
  );
}
