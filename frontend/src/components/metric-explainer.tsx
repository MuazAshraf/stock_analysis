"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricExplainerProps {
  label: string;
  fullForm?: string;
  explanation: string;
}

export function MetricExplainer({
  label,
  fullForm,
  explanation,
}: MetricExplainerProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="font-semibold text-[#404E3F]">
        {fullForm ? `${label} (${fullForm})` : label}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex cursor-help">
            <Info className="h-4 w-4 text-[#2B5288]/60" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs bg-[#404E3F] text-white text-sm"
        >
          {explanation}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
