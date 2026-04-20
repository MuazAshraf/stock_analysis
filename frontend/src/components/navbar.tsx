"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Analyze" },
  { href: "/learn", label: "Learn" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#E5E0D9] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 rounded-lg bg-[#4BC232] flex items-center justify-center flex-shrink-0">
            <BarChart3 className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold text-[#404E3F] leading-tight">PSX Stock Analyzer</p>
            <p className="text-[11px] text-[#404E3F]/50 leading-tight hidden sm:block">
              Pakistan Stock Exchange — Simple Analysis
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-[#404E3F] hover:text-[#4BC232] hover:bg-[#4BC232]/10 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-[#404E3F] hover:bg-[#F8F3EA] rounded-lg"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-[#E5E0D9] bg-white"
          aria-label="Mobile navigation"
        >
          <div className="max-w-5xl mx-auto px-4 py-2 flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm font-medium text-[#404E3F] hover:text-[#4BC232] hover:bg-[#4BC232]/10 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
