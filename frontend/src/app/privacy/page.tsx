import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for PSX Stock Analyzer. Learn how we handle your data and protect your privacy.",
  alternates: { canonical: "https://psxstocksanalyzer.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-brand-card rounded-xl border border-brand-border p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-fg">Privacy Policy</h1>
            <p className="text-sm text-brand-fg/50 mt-1">Last updated: March 2026</p>
          </div>

          <Section title="Overview">
            PSX Stock Analyzer (&quot;we&quot;, &quot;our&quot;, &quot;the tool&quot;) is a free stock analysis tool
            for the Pakistan Stock Exchange (PSX) that explains stocks in plain English for beginner
            Pakistani investors. We are committed to protecting your privacy. This policy explains
            how we handle information when you use our website at psxstocksanalyzer.com.
          </Section>

          <Section title="Information We Collect">
            <strong>We do not collect any personal information.</strong> There are no user accounts,
            no login, no registration, and no forms that collect your personal data. We do not store
            your name, email address, phone number, or any other personally identifiable information.
          </Section>

          <Section title="Stock Data">
            When you analyze a stock, we fetch data in real-time from the PSX Data Portal
            (dps.psx.com.pk) and Yahoo Finance. This data is displayed to you immediately and is
            not stored on our servers. Each analysis is a fresh request — we do not maintain a database
            of your analysis history.
          </Section>

          <Section title="Cookies and Advertising">
            We use Google AdSense to display advertisements on our website. Google AdSense may use
            cookies and similar technologies to serve ads based on your prior visits to our website
            or other websites. Google&apos;s use of advertising cookies enables it and its partners to
            serve ads based on your browsing patterns.
            <br /><br />
            You may opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
              className="text-[#2B5288] underline">Google Ad Settings</a>.
            <br /><br />
            We do not set any cookies ourselves. All cookies on this site are from third-party
            advertising services.
          </Section>

          <Section title="Third-Party Services">
            Our website uses the following third-party services:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Google AdSense</strong> — for displaying advertisements</li>
              <li><strong>PSX Data Portal</strong> (dps.psx.com.pk) — for live stock price and company data</li>
              <li><strong>Yahoo Finance</strong> — for financial statements, price history, and book value data</li>
              <li><strong>Vercel</strong> — for website hosting</li>
            </ul>
            Each of these services has its own privacy policy. We encourage you to review them.
          </Section>

          <Section title="Data Security">
            Since we do not collect or store personal data, there is minimal risk to your privacy.
            All connections to our website are encrypted via HTTPS.
          </Section>

          <Section title="Children&apos;s Privacy">
            Our service is not directed to children under 13. We do not knowingly collect any
            information from children.
          </Section>

          <Section title="Changes to This Policy">
            We may update this Privacy Policy from time to time. Any changes will be reflected on
            this page with an updated date.
          </Section>

          <Section title="Contact">
            If you have questions about this Privacy Policy, please visit our{" "}
            <Link href="/contact" className="text-[#2B5288] underline">Contact page</Link>.
          </Section>
        </div>
      </main>

    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-brand-fg mb-2">{title}</h2>
      <p className="text-sm text-brand-fg/70 leading-relaxed">{children}</p>
    </div>
  );
}
