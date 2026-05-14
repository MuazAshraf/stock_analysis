"use client";

import { cn } from "@/lib/utils";

export type PsxIndex = "KSE100" | "KSE30" | "ALL";

interface IndexToggleProps {
  value: PsxIndex;
  onChange: (index: PsxIndex) => void;
  disabled?: boolean;
}

const OPTIONS: { value: PsxIndex; label: string }[] = [
  { value: "KSE100", label: "KSE 100" },
  { value: "KSE30", label: "KSE 30" },
  { value: "ALL", label: "All Stocks" },
];

export function IndexToggle({ value, onChange, disabled }: IndexToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-brand-border bg-brand-card p-1 gap-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            value === opt.value
              ? "bg-[#4BC232] text-white shadow-sm"
              : "text-brand-fg/60 hover:text-brand-fg hover:bg-brand-bg"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
