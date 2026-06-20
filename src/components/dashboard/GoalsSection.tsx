import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Goal } from "@/hooks/use-carbon-data";

type GoalsSectionProps = {
  goals: Goal[];
  className?: string;
};

export const GoalsSection = React.memo(function GoalsSection({
  goals,
  className,
}: GoalsSectionProps) {
  return (
    <section
      className={`col-span-12 lg:col-span-5 rounded-3xl bg-card border border-border ring-soft p-6 ${className || ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Weekly goals</h3>
        <Link
          to="/progress"
          className="text-xs text-primary font-medium inline-flex items-center gap-1"
        >
          All <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <ul className="space-y-3">
        {goals.map((g) => (
          <li
            key={g.title}
            className="rounded-2xl border border-border p-4 hover:bg-accent/40 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm">{g.title}</div>
              <span className="text-[11px] font-semibold text-success rounded-full bg-success/10 px-2 py-0.5 shrink-0">
                {g.reward}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"
                role="progressbar"
                aria-valuenow={g.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress of goal: ${g.title}`}
              >
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${g.progress}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">{g.progress}%</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});
