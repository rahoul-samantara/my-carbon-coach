import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 animate-pulse">
      {/* BudgetHero Skeleton */}
      <section className="col-span-12 lg:col-span-8 rounded-3xl bg-card border border-border p-6 sm:p-8 relative overflow-hidden h-[280px] flex items-center">
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full">
          <div className="h-44 w-44 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="h-10 w-48 rounded bg-muted" />
            <div className="h-4 w-64 rounded bg-muted" />
            <div className="flex gap-2 pt-2">
              <div className="h-9 w-28 rounded-full bg-muted" />
              <div className="h-9 w-28 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Trend Chart Skeleton */}
      <section className="col-span-12 lg:col-span-4 rounded-3xl bg-card border border-border p-6 h-[280px] flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-5 w-28 rounded bg-muted" />
          <div className="h-4 w-12 rounded bg-muted" />
        </div>
        <div className="h-32 w-full bg-muted/60 rounded-xl" />
        <div className="h-4 w-36 rounded bg-muted" />
      </section>

      {/* Impact Breakdown Skeleton */}
      <section className="col-span-12 lg:col-span-7 rounded-3xl bg-card border border-border p-6 h-[270px] space-y-5">
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-28 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
              </div>
              <div className="h-2 w-full rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Goals Skeleton */}
      <section className="col-span-12 lg:col-span-5 rounded-3xl bg-card border border-border p-6 h-[270px] space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-28 rounded bg-muted" />
          <div className="h-4 w-8 rounded bg-muted" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-2xl p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-4.5 w-14 rounded-full bg-muted" />
              </div>
              <div className="h-1.5 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activities Skeleton */}
      <section className="col-span-12 rounded-3xl bg-card border border-border p-6 h-[240px] space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
        <div className="space-y-3 pt-2 divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center pt-3 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="h-3.5 w-24 rounded bg-muted" />
                </div>
              </div>
              <div className="h-4.5 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
