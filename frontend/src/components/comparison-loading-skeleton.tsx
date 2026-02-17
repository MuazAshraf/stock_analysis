"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ComparisonLoadingSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Header: two companies */}
      <Card className="border-[#E5E0D9]">
        <CardContent className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-5 w-16 bg-[#E5E0D9]" />
              <Skeleton className="h-6 w-40 bg-[#E5E0D9]" />
              <Skeleton className="h-8 w-28 bg-[#E5E0D9]" />
              <Skeleton className="h-4 w-24 bg-[#E5E0D9]" />
            </div>
            <div className="flex items-center justify-center">
              <Skeleton className="h-12 w-12 rounded-full bg-[#E5E0D9]" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-5 w-16 bg-[#E5E0D9]" />
              <Skeleton className="h-6 w-40 bg-[#E5E0D9]" />
              <Skeleton className="h-8 w-28 bg-[#E5E0D9]" />
              <Skeleton className="h-4 w-24 bg-[#E5E0D9]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoreboard */}
      <Card className="border-[#E5E0D9]">
        <CardContent className="py-6">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-6 w-32 bg-[#E5E0D9]" />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center max-w-md mx-auto">
            <Skeleton className="h-24 rounded-xl bg-[#E5E0D9]" />
            <Skeleton className="h-6 w-4 bg-[#E5E0D9]" />
            <Skeleton className="h-24 rounded-xl bg-[#E5E0D9]" />
          </div>
        </CardContent>
      </Card>

      {/* Metric cards */}
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="border-[#E5E0D9]">
          <CardContent className="py-5 px-5">
            <div className="mb-4">
              <Skeleton className="h-5 w-48 bg-[#E5E0D9]" />
              <Skeleton className="h-3 w-64 bg-[#E5E0D9] mt-2" />
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
              <Skeleton className="h-16 rounded-lg bg-[#E5E0D9]" />
              <Skeleton className="h-4 w-4 bg-[#E5E0D9]" />
              <Skeleton className="h-16 rounded-lg bg-[#E5E0D9]" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg bg-[#E5E0D9] mt-3" />
          </CardContent>
        </Card>
      ))}

      {/* Verdict */}
      <Card className="border-[#E5E0D9]">
        <CardContent className="py-5">
          <Skeleton className="h-5 w-36 bg-[#E5E0D9] mb-3" />
          <Skeleton className="h-4 w-full bg-[#E5E0D9]" />
          <Skeleton className="h-4 w-3/4 bg-[#E5E0D9] mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
