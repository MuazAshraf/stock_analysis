"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getStocks } from "@/lib/api";
import { StockCombobox } from "@/components/stock-combobox";
import { IndexToggle, type PsxIndex } from "@/components/index-toggle";

interface SearchBarProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onAnalyze, isLoading }: SearchBarProps) {
  const [index, setIndex] = useState<PsxIndex>("KSE100");
  const [selected, setSelected] = useState<string | null>(null);

  const { data: stocks = [], isLoading: stocksLoading } = useQuery({
    queryKey: ["stocks", index],
    queryFn: () => getStocks(index),
    staleTime: 1000 * 60 * 60,
  });

  function handleIndexChange(newIndex: PsxIndex) {
    setIndex(newIndex);
    setSelected(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected && !isLoading) {
      onAnalyze(`https://dps.psx.com.pk/company/${selected}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex justify-center mb-4">
        <IndexToggle
          value={index}
          onChange={handleIndexChange}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <StockCombobox
            stocks={stocks}
            value={selected}
            onChange={setSelected}
            placeholder="Pick a stock to analyze..."
            disabled={isLoading}
            isLoading={stocksLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={!selected || isLoading}
          className="h-12 px-8 text-base font-semibold bg-[#4BC232] hover:bg-[#3da828] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Stock"
          )}
        </Button>
      </div>
    </form>
  );
}
