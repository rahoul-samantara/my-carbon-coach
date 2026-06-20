import React from "react";
import { Activity, CategoryData } from "@/hooks/use-carbon-data";

type RecentActivitiesProps = {
  recentActivity: Activity[];
  categories: CategoryData[];
  className?: string;
};

export const RecentActivities = React.memo(function RecentActivities({
  recentActivity,
  categories,
  className,
}: RecentActivitiesProps) {
  return (
    <section
      className={`col-span-12 rounded-3xl bg-card border border-border ring-soft p-6 ${className || ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Recent activity</h3>
        <span className="text-xs text-muted-foreground">Historical records</span>
      </div>
      <ul className="divide-y divide-border">
        {recentActivity.map((a) => {
          const cat = categories.find((c) => c.key === a.category) || {
            label: "General",
            color: "var(--color-primary)",
          };
          return (
            <li key={a.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-9 w-9 rounded-xl grid place-items-center text-xs font-semibold shrink-0"
                  style={{
                    background: `color-mix(in oklab, ${cat.color} 18%, transparent)`,
                    color: cat.color,
                  }}
                >
                  {cat.label[0]}
                </span>
                <div className="min-w-0">
                  <div className="font-medium truncate">{a.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.when} · {cat.label}
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold tabular-nums shrink-0">
                {a.kg.toFixed(1)} kg
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});
