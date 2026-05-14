import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-card mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="col-span-2 md:col-span-1">
            <p className="font-bold text-brand-fg">PSX Stock Analyzer</p>
            <p className="text-xs text-brand-fg/60 mt-2 leading-relaxed">
              Free Pakistan Stock Exchange analysis in plain English for beginner investors.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-fg uppercase tracking-wider">Product</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/" className="text-sm text-brand-fg/70 hover:text-[#4BC232]">Analyze</Link></li>
              <li><Link href="/learn" className="text-sm text-brand-fg/70 hover:text-[#4BC232]">Learn</Link></li>
              <li><Link href="/faq" className="text-sm text-brand-fg/70 hover:text-[#4BC232]">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-fg uppercase tracking-wider">Company</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-sm text-brand-fg/70 hover:text-[#4BC232]">About</Link></li>
              <li><Link href="/contact" className="text-sm text-brand-fg/70 hover:text-[#4BC232]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-fg uppercase tracking-wider">Legal</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/privacy" className="text-sm text-brand-fg/70 hover:text-[#4BC232]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-brand-fg/70 hover:text-[#4BC232]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-6 text-center">
          <p className="text-xs text-brand-fg/50">
            For educational purposes only. Not financial advice. © {new Date().getFullYear()} PSX Stock Analyzer.
          </p>
        </div>
      </div>
    </footer>
  );
}
