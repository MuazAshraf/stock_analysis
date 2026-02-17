"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onAnalyze, isLoading }: SearchBarProps) {
  const [url, setUrl] = useState("");

  const isValidUrl = /^https:\/\/dps\.psx\.com\.pk\/company\/[A-Za-z0-9]+\/?$/.test(url.trim());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValidUrl && !isLoading) {
      onAnalyze(url.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#404E3F]/50" />
          <Input
            type="url"
            placeholder="Paste PSX stock URL, e.g. https://dps.psx.com.pk/company/ENGRO"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 h-12 text-base border-[#E5E0D9] bg-white focus-visible:ring-[#4BC232] focus-visible:border-[#4BC232]"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={!isValidUrl || isLoading}
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
      {url.length > 0 && !isValidUrl && (
        <p className="text-sm text-red-500 mt-2">
          Please paste a valid PSX URL like: https://dps.psx.com.pk/company/ENGRO
        </p>
      )}
    </form>
  );
}
