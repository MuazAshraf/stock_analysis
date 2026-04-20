import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "P/E Ratio Explained: How to Use It for PSX Stocks";
const DESCRIPTION =
  "Learn what the Price-to-Earnings (P/E) ratio means, how it's calculated, and how Pakistani investors can use it to spot cheap or expensive PSX stocks. Simple English, real examples.";
const URL = "https://psxstocksanalyzer.com/learn/pe-ratio-explained";
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
  about: { "@type": "Thing", name: "Price-to-Earnings Ratio" },
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
            <span>P/E Ratio Explained</span>
          </nav>

          <h1 className="text-2xl font-bold text-[#404E3F]">{TITLE}</h1>
          <p className="text-xs text-[#404E3F]/50">Updated April 2026 · 6 min read</p>

          <section className="space-y-3">
            <p className="text-sm text-[#404E3F]/80 leading-relaxed">
              <strong>Short answer:</strong> The P/E ratio tells you how much you are paying for every one rupee of a company&apos;s yearly profit. A P/E of 10 means you pay Rs. 10 for every Rs. 1 of annual earnings. Lower P/E can mean the stock is cheap — but not always. You always need to compare within the same sector.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">What does P/E stand for?</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              P/E stands for <strong>Price-to-Earnings</strong>. It is one of the most widely used numbers in stock analysis. It compares a company&apos;s share price to the profit it earns per share.
            </p>
            <div className="p-4 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]">
              <p className="text-sm text-[#404E3F] font-mono">
                P/E Ratio = Share Price ÷ Earnings Per Share (EPS)
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">What is EPS (Earnings Per Share)?</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              EPS is the company&apos;s yearly profit divided by the total number of shares it has issued.
            </p>
            <div className="p-4 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]">
              <p className="text-sm text-[#404E3F] font-mono">
                EPS = Net Profit After Tax ÷ Total Shares Outstanding
              </p>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Example: if a company made Rs. 1 billion profit last year and has 100 million shares, its EPS is Rs. 10 per share.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">A simple P/E example</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Suppose a PSX-listed company trades at <strong>Rs. 150</strong> per share and has an EPS of <strong>Rs. 15</strong>. Its P/E ratio is:
            </p>
            <div className="p-4 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]">
              <p className="text-sm text-[#404E3F] font-mono">
                P/E = 150 ÷ 15 = 10
              </p>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              A P/E of 10 means if the company keeps earning the same profit every year, it would take 10 years for you to earn back what you paid — in theory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">How to read a P/E ratio</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#404E3F]/80">
                <thead>
                  <tr className="border-b border-[#E5E0D9]">
                    <th className="text-left py-2 pr-4 font-semibold">P/E Range</th>
                    <th className="text-left py-2 font-semibold">What it usually means</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#E5E0D9]">
                    <td className="py-2 pr-4 font-mono">Below 7</td>
                    <td className="py-2">Possibly undervalued, or the market expects profits to fall</td>
                  </tr>
                  <tr className="border-b border-[#E5E0D9]">
                    <td className="py-2 pr-4 font-mono">7 – 15</td>
                    <td className="py-2">Typical range for many mature PSX companies</td>
                  </tr>
                  <tr className="border-b border-[#E5E0D9]">
                    <td className="py-2 pr-4 font-mono">15 – 25</td>
                    <td className="py-2">Investors expect strong future growth</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">Above 25</td>
                    <td className="py-2">Either very high growth expectations or possibly overvalued</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              The KSE-100 index as a whole has historically traded at a P/E between roughly 6 and 12 — lower than most international markets. This is one reason many analysts describe PSX as a value market.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Always compare within the same sector</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              A P/E of 15 is high for a cement company but low for a technology company. Different sectors have different &quot;normal&quot; P/E ranges. For example:
            </p>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Banks and cement</strong> usually trade at lower P/Es (5–12)</li>
              <li><strong>Consumer goods</strong> often trade at higher P/Es (15–30)</li>
              <li><strong>Technology and pharma</strong> can trade at very high P/Es if growth is strong</li>
            </ul>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              The right way to use P/E is to compare a company against others in the same industry and against its own past P/E history.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Trailing P/E vs Forward P/E</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Trailing P/E:</strong> uses profits from the last 12 months. Based on real, reported numbers.</li>
              <li><strong>Forward P/E:</strong> uses analyst estimates of next year&apos;s profits. Based on expectations, not certainty.</li>
            </ul>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Most free tools — including <Link href="/" className="text-[#2B5288] underline">PSX Stock Analyzer</Link> — show trailing P/E because it uses confirmed data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">When P/E can mislead you</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Loss-making companies:</strong> if profit is zero or negative, P/E is meaningless</li>
              <li><strong>One-off profits:</strong> a land sale or tax refund can temporarily reduce the P/E</li>
              <li><strong>Cyclical sectors:</strong> cement or banks can look cheap near a market peak and expensive near a trough</li>
              <li><strong>High debt:</strong> P/E ignores how much the company owes</li>
            </ul>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              P/E should never be the only number you check. Always look at profit trends, debt levels, dividend history, and cash flow too.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">How to find a PSX stock&apos;s P/E</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              You can see any PSX company&apos;s P/E in its profile on the{" "}
              <a href="https://dps.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                PSX Data Portal
              </a>
              . Or use <Link href="/" className="text-[#2B5288] underline">PSX Stock Analyzer</Link> — paste any company&apos;s PSX URL and you&apos;ll see its P/E ratio along with a plain-English explanation of whether it looks cheap, fair, or expensive.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Sources &amp; further reading</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li>
                <a href="https://www.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Pakistan Stock Exchange (psx.com.pk)
                </a>
              </li>
              <li>
                <a href="https://dps.psx.com.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  PSX Data Portal (dps.psx.com.pk)
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
            <p className="text-sm text-[#404E3F] text-center leading-relaxed">
              See the P/E ratio of any PSX stock in plain English —{" "}
              <Link href="/" className="text-[#2B5288] underline font-medium">analyze a stock now</Link>.
            </p>
          </div>

          <p className="text-xs text-[#404E3F]/50 border-t border-[#E5E0D9] pt-4">
            This article is for educational purposes only and is not financial advice. Always do your own research and consult a licensed financial adviser before investing.
          </p>
        </article>
      </main>

    </div>
  );
}
