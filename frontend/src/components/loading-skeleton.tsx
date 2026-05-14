"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Company Overview skeleton */}
      <Card className="border-brand-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-brand-border" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 bg-brand-border" />
                <Skeleton className="h-5 w-24 bg-brand-border" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-9 w-32 bg-brand-border" />
              <Skeleton className="h-5 w-24 bg-brand-border ml-auto" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full bg-brand-border rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-brand-border rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-16 w-full bg-brand-border rounded-lg" />
        </CardContent>
      </Card>

      {/* Charts skeleton */}
      <Card className="border-brand-border">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-brand-border" />
          <Skeleton className="h-4 w-64 bg-brand-border" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-32 bg-brand-border" />
              <Skeleton className="h-48 w-full bg-brand-border rounded-lg" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Check skeleton */}
      <Card className="border-brand-border">
        <CardHeader>
          <Skeleton className="h-6 w-36 bg-brand-border" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full bg-brand-border rounded-xl" />
          <Skeleton className="h-24 w-full bg-brand-border rounded-xl" />
        </CardContent>
      </Card>

      {/* Verdict skeleton */}
      <Card className="border-brand-border">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-brand-border" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 bg-brand-border rounded-xl" />
            <Skeleton className="h-24 bg-brand-border rounded-xl" />
          </div>
          <Skeleton className="h-16 w-full bg-brand-border rounded-xl" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-brand-border rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
