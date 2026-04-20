import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "How to Start Investing in the Pakistan Stock Exchange (PSX)";
const DESCRIPTION =
  "A complete beginner's guide to investing in PSX. Learn how to open a brokerage account, complete KYC, fund your account, and buy your first share — all in simple English.";
const URL = "https://psxstocksanalyzer.com/learn/how-to-start-investing-in-psx";
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
  about: { "@type": "Thing", name: "Pakistan Stock Exchange" },
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
            <span>How to Start Investing in PSX</span>
          </nav>

          <h1 className="text-2xl font-bold text-[#404E3F]">{TITLE}</h1>
          <p className="text-xs text-[#404E3F]/50">Updated April 2026 · 8 min read</p>

          <section className="space-y-3">
            <p className="text-sm text-[#404E3F]/80 leading-relaxed">
              <strong>Short answer:</strong> To invest in the Pakistan Stock Exchange, you need to (1) open an account with a PSX-registered broker, (2) complete KYC with your CNIC and bank details, (3) fund your account, and (4) buy shares through the broker&apos;s trading platform. The whole process can be done online in 2–5 working days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">What is the Pakistan Stock Exchange?</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              The Pakistan Stock Exchange (PSX) is the country&apos;s only stock exchange. It was formed on 11 January 2016 by merging the Karachi, Lahore, and Islamabad stock exchanges into one national exchange. PSX lists more than 500 companies across sectors like banking, cement, oil &amp; gas, fertiliser, and technology.
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              PSX is regulated by the <strong>Securities and Exchange Commission of Pakistan (SECP)</strong>. Trade clearing and settlement is handled by the <strong>National Clearing Company of Pakistan Limited (NCCPL)</strong>, and your shares are kept safe at the <strong>Central Depository Company (CDC)</strong> in electronic form.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Step 1 — Choose a broker</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              A broker is a company that buys and sells shares on your behalf. Only brokers registered with PSX can place trades. Well-known names include AKD Securities, JS Global Capital, Topline Securities, Arif Habib Limited, and Foundation Securities. You can find the full list of registered brokers on the official PSX website.
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              When picking a broker, compare:
            </p>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Commission:</strong> usually between 0.15% and 0.25% per trade</li>
              <li><strong>Minimum deposit:</strong> some brokers accept as low as PKR 1,000</li>
              <li><strong>Trading app:</strong> is the mobile app easy to use?</li>
              <li><strong>Customer support:</strong> do they respond quickly in Urdu or English?</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Step 2 — Open a CDC sub-account</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Once you pick a broker, you need to open a <strong>CDC sub-account</strong> through them. This is where your shares will actually be held. You do not have to visit the CDC office — your broker handles it for you.
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Documents you need:
            </p>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li>Copy of your CNIC (front and back)</li>
              <li>Proof of address (utility bill, bank statement, or tenancy agreement)</li>
              <li>Bank account details (account number and bank name)</li>
              <li>Recent photograph</li>
              <li>Source of income declaration</li>
            </ul>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Most brokers now offer fully digital account opening — you upload documents through their app and complete a video KYC call. Approval usually takes 2–5 working days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Step 3 — Fund your account</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              After your account is approved, transfer money from your personal bank account to the broker&apos;s client account. You can start small — many brokers have no minimum deposit, and shares of some companies trade for less than PKR 50 each.
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              <strong>Important:</strong> Never transfer money into a broker&apos;s personal account. Always send it to the registered client account number they provide. If in doubt, verify the account details directly on the PSX website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Step 4 — Buy your first share</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Log into your broker&apos;s trading app. Search for a company by its PSX symbol (for example <code className="px-1 rounded bg-[#F8F3EA] text-[#404E3F]">LUCK</code> for Lucky Cement or <code className="px-1 rounded bg-[#F8F3EA] text-[#404E3F]">OGDC</code> for Oil and Gas Development Company). Enter the number of shares you want to buy and the price you are willing to pay, then place the order.
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              PSX trading hours are <strong>9:30 AM to 3:30 PM Pakistan time, Monday to Friday</strong>. The market is closed on public holidays.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Step 5 — Research before you buy</h2>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Never buy a share just because a friend or a WhatsApp group recommended it. Before putting real money in, check the company&apos;s basics — is it making profit, does it pay dividends, how much debt does it carry, and is the price reasonable compared to its earnings?
            </p>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              You can get a free, plain-English breakdown of any PSX company using <Link href="/" className="text-[#2B5288] underline">PSX Stock Analyzer</Link>. Just paste the company&apos;s PSX URL and you&apos;ll see its price, financials, P/E ratio, dividend history, Shariah status, and an easy-to-understand verdict.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Taxes and charges to expect</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Broker commission:</strong> around 0.15%–0.25% on each trade</li>
              <li><strong>CDC charges:</strong> small annual custody fee (paid through broker)</li>
              <li><strong>Capital Gains Tax (CGT):</strong> charged on profits when you sell shares — rates change each year in the Federal Budget</li>
              <li><strong>Dividend withholding tax:</strong> deducted automatically when the company pays dividends</li>
            </ul>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              Tax rates are set by the <strong>Federal Board of Revenue (FBR)</strong> and may change. Check the latest tax treatment before making large investments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">Common mistakes beginners make</h2>
            <ul className="text-sm text-[#404E3F]/70 leading-relaxed list-disc pl-5 space-y-1">
              <li>Putting all savings into one stock instead of spreading the risk</li>
              <li>Following tips from unverified WhatsApp or Telegram groups</li>
              <li>Panic selling when the market drops temporarily</li>
              <li>Ignoring company financials and only looking at the share price</li>
              <li>Using borrowed money to buy shares</li>
            </ul>
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
                <a href="https://www.secp.gov.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Securities and Exchange Commission of Pakistan (secp.gov.pk)
                </a>
              </li>
              <li>
                <a href="https://www.nccpl.com.pk" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  National Clearing Company of Pakistan (nccpl.com.pk)
                </a>
              </li>
              <li>
                <a href="https://www.cdcpakistan.com" target="_blank" rel="noopener noreferrer" className="text-[#2B5288] underline">
                  Central Depository Company of Pakistan (cdcpakistan.com)
                </a>
              </li>
            </ul>
          </section>

          <div className="p-4 rounded-xl bg-[#4BC232]/10 border border-[#4BC232]/20">
            <p className="text-sm text-[#404E3F] text-center leading-relaxed">
              Ready to research a stock?{" "}
              <Link href="/" className="text-[#2B5288] underline font-medium">Analyze any PSX company for free</Link>.
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
