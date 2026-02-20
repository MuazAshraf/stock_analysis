"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeftRight } from "lucide-react";
import { getStocks } from "@/lib/api";
import { StockCombobox } from "@/components/stock-combobox";
import { IndexToggle, type PsxIndex } from "@/components/index-toggle";

interface CompareSearchProps {
  onCompare: (urlA: string, urlB: string) => void;
  isLoading: boolean;
}

export function CompareSearch({ onCompare, isLoading }: CompareSearchProps) {
  const [index, setIndex] = useState<PsxIndex>("KSE100");
  const [symbolA, setSymbolA] = useState<string | null>(null);
  const [symbolB, setSymbolB] = useState<string | null>(null);

  const { data: stocks = [], isLoading: stocksLoading } = useQuery({
    queryKey: ["stocks", index],
    queryFn: () => getStocks(index),
    staleTime: 1000 * 60 * 60,
  });

  function handleIndexChange(newIndex: PsxIndex) {
    setIndex(newIndex);
    setSymbolA(null);
    setSymbolB(null);
  }

  const canSubmit =
    symbolA && symbolB && symbolA !== symbolB && !isLoading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) {
      onCompare(
        `https://dps.psx.com.pk/company/${symbolA}`,
        `https://dps.psx.com.pk/company/${symbolB}`
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex justify-center mb-4">
        <IndexToggle
          value={index}
          onChange={handleIndexChange}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="flex-1">
          <StockCombobox
            stocks={stocks}
            value={symbolA}
            onChange={setSymbolA}
            placeholder="Pick Stock A..."
            disabled={isLoading}
            isLoading={stocksLoading}
          />
        </div>
        <div className="flex items-center justify-center sm:px-1">
          <ArrowLeftRight className="h-5 w-5 text-[#404E3F]/40" />
        </div>
        <div className="flex-1">
          <StockCombobox
            stocks={stocks}
            value={symbolB}
            onChange={setSymbolB}
            placeholder="Pick Stock B..."
            disabled={isLoading}
            isLoading={stocksLoading}
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-4 gap-2">
        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-12 px-8 text-base font-semibold bg-[#4BC232] hover:bg-[#3da828] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Comparing...
            </>
          ) : (
            "Compare Stocks"
          )}
        </Button>
        {symbolA && symbolB && symbolA === symbolB && (
          <p className="text-sm text-red-500">
            Please pick two different stocks to compare.
          </p>
        )}
      </div>
    </form>
  );
}
