import React from "react";
import { Link } from "@tanstack/react-router";
import { Plus, MessageSquareHeart, SlidersHorizontal, TrendingDown } from "lucide-react";

type BudgetHeroProps = {
  name: string;
  monthlyBudgetKg: number;
  usedKg: number;
  remainingKg: number;
  pct: number;
  dash: number;
  circumference: number;
  onLogClick: () => void;
  className?: string;
};

export const BudgetHero = React.memo(function BudgetHero({
  name,
  monthlyBudgetKg,
  usedKg,
  remainingKg,
  pct,
  dash,
  circumference,
  onLogClick,
  className,
}: BudgetHeroProps) {
  return (
    <section
      className={`col-span-12 lg:col-span-8 rounded-3xl bg-card border border-border ring-soft p-6 sm:p-8 relative overflow-hidden ${className || ""}`}
    >
      <div
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-leaf/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 relative">
        <div className="relative shrink-0">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="-rotate-90"
            role="img"
            aria-label={`Circular progress chart showing user has consumed ${pct}% of their monthly carbon budget`}
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="14"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-display text-4xl font-semibold">{pct}%</div>
              <div className="text-xs text-muted-foreground mt-1">of monthly budget</div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3 py-1 text-xs font-medium">
            <TrendingDown className="h-3.5 w-3.5" /> Tracked Carbon Activity
          </div>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold">
            {usedKg}{" "}
            <span className="text-muted-foreground font-sans text-base font-normal">
              kg CO₂e used
            </span>
          </h2>
          <div className="mt-1 text-sm text-muted-foreground">
            {remainingKg} kg remaining of {monthlyBudgetKg} kg this month
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={onLogClick}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Log activity
            </button>
            <Link
              to="/coach"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              <MessageSquareHeart className="h-4 w-4" /> Ask coach
            </Link>
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              <SlidersHorizontal className="h-4 w-4" /> Simulate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});
