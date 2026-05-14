"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { StockListItem } from "@/types/stock";

interface StockComboboxProps {
  stocks: StockListItem[];
  value: string | null;
  onChange: (symbol: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function StockCombobox({
  stocks,
  value,
  onChange,
  placeholder = "Select a stock...",
  disabled = false,
  isLoading = false,
}: StockComboboxProps) {
  const [open, setOpen] = useState(false);

  const selected = stocks.find((s) => s.symbol === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className="w-full h-12 justify-between text-base font-normal border-brand-border bg-brand-card hover:bg-brand-card focus-visible:ring-[#4BC232] focus-visible:border-[#4BC232] cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-brand-fg/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading stocks...
            </span>
          ) : selected ? (
            <span className="flex items-center gap-2 truncate">
              <span className="inline-flex items-center rounded bg-[#4BC232]/10 px-2 py-0.5 text-xs font-semibold text-[#4BC232]">
                {selected.symbol}
              </span>
              <span className="truncate text-brand-fg/70">
                {selected.name}
              </span>
            </span>
          ) : (
            <span className="text-brand-fg/50">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command
          filter={(value, search) => {
            const stock = stocks.find((s) => s.symbol === value);
            if (!stock) return 0;
            const hay = `${stock.symbol} ${stock.name}`.toLowerCase();
            return hay.includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search by name or symbol..." />
          <CommandList>
            <CommandEmpty>No stock found.</CommandEmpty>
            <CommandGroup>
              {stocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={stock.symbol}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? null : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === stock.symbol ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-semibold text-brand-fg mr-2">
                    {stock.symbol}
                  </span>
                  <span className="truncate text-brand-fg/60">
                    {stock.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
