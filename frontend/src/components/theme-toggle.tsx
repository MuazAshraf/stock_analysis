"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

/**
 * Theme-aware chart palette. Recharts/ApexCharts/raw SVG props take string
 * values, not Tailwind classes — so they can't read CSS variables directly.
 * This hook exposes the same brand colors defined in globals.css as JS strings,
 * switching automatically when the theme changes.
 *
 * Keep these values in sync with `--brand-*` in globals.css.
 */
export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return useMemo(
    () => ({
      fg: isDark ? "#F8F3EA" : "#404E3F",       // body / heading text
      bg: isDark ? "#1A1714" : "#F8F3EA",       // page bg
      card: isDark ? "#252220" : "#FFFFFF",     // card bg
      soft: isDark ? "#2A2622" : "#F3F1E5",     // soft pill bg
      border: isDark ? "#3D3833" : "#E5E0D9",   // borders
      // Brand accents stay the same in both modes.
      brandGreen: "#4BC232",
      brandBlue: "#2B5288",
    }),
    [isDark],
  );
}

/**
 * Two-state light/dark toggle. Uses next-themes — handles SSR, system
 * preference, no-flash-on-load, and persistence to localStorage.
 *
 * Renders a stable placeholder until hydration completes so the server-
 * rendered HTML doesn't mismatch the client's theme class.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-lg text-brand-fg hover:bg-brand-soft transition-colors cursor-pointer"
    >
      {/* Render Sun by default to avoid hydration flicker; swap once mounted. */}
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
