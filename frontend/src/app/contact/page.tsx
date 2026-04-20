import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, AlertTriangle } from "lucide-react";
import { FeedbackForm } from "@/components/feedback-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact PSX Stock Analyzer. We are a free educational stock analysis tool — not financial advisors.",
  alternates: { canonical: "https://psxstocksanalyzer.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F3EA]">
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-[#E5E0D9] p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#404E3F]">Contact Us</h1>
            <p className="text-sm text-[#404E3F]/60 mt-2 leading-relaxed">
              PSX Stock Analyzer is a free stock analysis tool for the Pakistan Stock Exchange (PSX) that explains stocks in plain English for beginner Pakistani investors. We are not financial advisors and do not provide investment recommendations.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Important</p>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">
                We do not provide financial advice, investment recommendations, stock tips, or
                personalized consulting services. This tool is for educational and informational
                purposes only. For investment decisions, please consult a licensed financial advisor.
              </p>
            </div>
          </div>

          {/* Feedback section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#4BC232]" />
              <h2 className="text-base font-semibold text-[#404E3F]">Feedback & Suggestions</h2>
            </div>
            <p className="text-sm text-[#404E3F]/70 leading-relaxed">
              We appreciate your feedback! If you have suggestions for improving the tool, found a
              bug, or want to request a feature, we&apos;d love to hear from you.
            </p>

            <FeedbackForm />
          </div>

          {/* What we can help with */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">What We Can Help With</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <HelpItem title="Bug Reports" desc="Something not working? Let us know and we'll fix it." />
              <HelpItem title="Feature Requests" desc="Want a new feature? We're always looking to improve." />
              <HelpItem title="Data Issues" desc="Found incorrect data? We'll investigate the source." />
              <HelpItem title="General Feedback" desc="Love it? Hate it? Tell us how to make it better." />
            </div>
          </div>

          {/* What we cannot help with */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#404E3F]">What We Cannot Help With</h2>
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
              <ul className="space-y-2 text-sm text-[#404E3F]/70">
                <li>- Investment advice or stock recommendations</li>
                <li>- Portfolio management or financial planning</li>
                <li>- Broker account setup or trading assistance</li>
                <li>- Tax advice related to stock trading</li>
              </ul>
              <p className="text-xs text-[#404E3F]/50 mt-3">
                For these services, please consult a SECP-licensed financial advisor or your broker.
              </p>
            </div>
          </div>

          <div className="text-sm text-[#404E3F]/50 text-center pt-2">
            <p>
              Also see our{" "}
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

function HelpItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg bg-[#F8F3EA]">
      <h3 className="text-sm font-semibold text-[#404E3F]">{title}</h3>
      <p className="text-xs text-[#404E3F]/60 mt-0.5">{desc}</p>
    </div>
  );
}
