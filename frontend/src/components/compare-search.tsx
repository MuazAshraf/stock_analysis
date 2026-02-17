"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowLeftRight } from "lucide-react";

interface CompareSearchProps {
  onCompare: (urlA: string, urlB: string) => void;
  isLoading: boolean;
}

const PSX_URL_REGEX = /^https:\/\/dps\.psx\.com\.pk\/company\/[A-Za-z0-9]+\/?$/;

export function CompareSearch({ onCompare, isLoading }: CompareSearchProps) {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");

  const isValidA = PSX_URL_REGEX.test(urlA.trim());
  const isValidB = PSX_URL_REGEX.test(urlB.trim());
  const canSubmit = isValidA && isValidB && !isLoading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) {
      onCompare(urlA.trim(), urlB.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#404E3F]/50" />
          <Input
            type="url"
            placeholder="Stock A URL, e.g. https://dps.psx.com.pk/company/ENGRO"
            value={urlA}
            onChange={(e) => setUrlA(e.target.value)}
            className="pl-10 h-12 text-base border-[#E5E0D9] bg-white focus-visible:ring-[#4BC232] focus-visible:border-[#4BC232]"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-center sm:px-1">
          <ArrowLeftRight className="h-5 w-5 text-[#404E3F]/40" />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#404E3F]/50" />
          <Input
            type="url"
            placeholder="Stock B URL, e.g. https://dps.psx.com.pk/company/OGDC"
            value={urlB}
            onChange={(e) => setUrlB(e.target.value)}
            className="pl-10 h-12 text-base border-[#E5E0D9] bg-white focus-visible:ring-[#4BC232] focus-visible:border-[#4BC232]"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="flex justify-center mt-4">
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
      </div>
      {/* Validation messages */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <div className="flex-1">
          {urlA.length > 0 && !isValidA && (
            <p className="text-sm text-red-500">
              Please paste a valid PSX URL like: https://dps.psx.com.pk/company/ENGRO
            </p>
          )}
        </div>
        <div className="hidden sm:block sm:px-1 w-5" />
        <div className="flex-1">
          {urlB.length > 0 && !isValidB && (
            <p className="text-sm text-red-500">
              Please paste a valid PSX URL like: https://dps.psx.com.pk/company/OGDC
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
