import React from "react";
import { CategoryData } from "@/hooks/use-carbon-data";

type ImpactBreakdownProps = {
  categories: CategoryData[];
  className?: string;
};

export const ImpactBreakdown = React.memo(function ImpactBreakdown({
  categories,
  className,
}: ImpactBreakdownProps) {
  return (
    <section
      className={`col-span-12 lg:col-span-7 rounded-3xl bg-card border border-border ring-soft p-6 ${className || ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Impact breakdown</h3>
        <span className="text-xs text-muted-foreground">this month</span>
      </div>
      <ul className="space-y-4">
        {categories.map((c) => {
          const p = c.budgetKg > 0 ? Math.round((c.usedKg / c.budgetKg) * 100) : 0;
          return (
            <li key={c.key}>
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: c.color }}
                  />
                  <span className="font-medium truncate">{c.label}</span>
                  <span
                    className={`text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 ${
                      c.impact === "High"
                        ? "bg-destructive/10 text-destructive"
                        : c.impact === "Medium"
                          ? "bg-warning/15 text-warning-foreground"
                          : "bg-success/10 text-success"
                    }`}
                  >
                    {c.impact}
                  </span>
                </div>
                <div className="text-sm tabular-nums text-muted-foreground shrink-0">
                  <span className="text-foreground font-semibold">{c.usedKg}</span> / {c.budgetKg}{" "}
                  kg
                </div>
              </div>
              <div
                className="mt-2 h-2 rounded-full bg-muted overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.min(p, 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${c.label} consumption progress`}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(p, 100)}%`, background: c.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});
