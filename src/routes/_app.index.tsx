import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useCarbonData } from "@/hooks/use-carbon-data";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from "recharts";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BudgetHero } from "@/components/dashboard/BudgetHero";
import { ImpactBreakdown } from "@/components/dashboard/ImpactBreakdown";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Carbon Compass" },
      {
        name: "description",
        content: "Your monthly carbon budget, impact breakdown, and weekly goals at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const PRESETS = [
  { label: "Subway ride (10 km)", category: "transport", kg: 0.4 },
  { label: "Car ride (15 km)", category: "transport", kg: 3.0 },
  { label: "Beef burger meal", category: "food", kg: 4.5 },
  { label: "Vegetarian lunch", category: "food", kg: 0.9 },
  { label: "Online delivery package", category: "shopping", kg: 2.3 },
  { label: "Ran washer (hot water)", category: "energy", kg: 1.5 },
];

export function Dashboard() {
  const {
    carbonProfile,
    categories,
    monthlyTrend,
    weeklyGoals,
    recentActivity,
    logNewActivity,
    loading,
  } = useCarbonData();
  const [showLogModal, setShowLogModal] = useState(false);
  const [logLabel, setLogLabel] = useState("");
  const [logCategory, setLogCategory] = useState("transport");
  const [logKg, setLogKg] = useState("");

  if (loading) {
    return (
      <AppShell title="Good morning..." subtitle="Loading your carbon budget...">
        <DashboardSkeleton />
      </AppShell>
    );
  }

  const { monthlyBudgetKg, usedKg, remainingKg } = carbonProfile;
  const pct = monthlyBudgetKg > 0 ? Math.round((usedKg / monthlyBudgetKg) * 100) : 0;
  const circumference = 2 * Math.PI * 80;
  const dash = (Math.min(pct, 100) / 100) * circumference;

  const handlePresetSelect = (preset: (typeof PRESETS)[number]) => {
    setLogLabel(preset.label);
    setLogCategory(preset.category);
    setLogKg(preset.kg.toString());
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logLabel || !logKg) return;

    await logNewActivity(logLabel, logCategory, parseFloat(logKg));
    setLogLabel("");
    setLogKg("");
    setShowLogModal(false);
  };

  return (
    <AppShell
      title={`Good morning, ${carbonProfile.name.split(" ")[0]}`}
      subtitle={`You've used ${pct}% of your carbon budget so far.`}
    >
      <div className="grid grid-cols-12 gap-4">
        <BudgetHero
          name={carbonProfile.name}
          monthlyBudgetKg={monthlyBudgetKg}
          usedKg={usedKg}
          remainingKg={remainingKg}
          pct={pct}
          dash={dash}
          circumference={circumference}
          onLogClick={() => setShowLogModal(true)}
          className="animate-card-fade-in stagger-1"
        />

        {/* Trend chart */}
        <section className="col-span-12 lg:col-span-4 rounded-3xl bg-card border border-border ring-soft p-6 animate-card-fade-in stagger-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">6-month trend</h2>
            <span className="text-xs text-muted-foreground">kg CO₂e</span>
          </div>
          <div className="mt-4 h-44 -mx-2">
            <ResponsiveContainer width="100%" height="100%" role="img" aria-label="Area chart showing monthly carbon emission trends against goals.">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="var(--color-border)"
                  vertical={false}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  cursor={{ stroke: "var(--color-border)" }}
                />
                <Area
                  type="monotone"
                  dataKey="kg"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#trend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-success font-medium">
            Monthly budget progress tracker
          </div>
        </section>

        <ImpactBreakdown categories={categories} className="animate-card-fade-in stagger-3" />
        <GoalsSection goals={weeklyGoals} className="animate-card-fade-in stagger-4" />
        <RecentActivities
          recentActivity={recentActivity}
          categories={categories}
          className="animate-card-fade-in stagger-5"
        />
      </div>

      {/* Log Activity Modal */}
      <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
        <DialogContent className="max-w-md rounded-3xl bg-card border border-border p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold">
              Log Carbon Activity
            </DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <span className="text-xs font-semibold text-muted-foreground block mb-2">
              Or choose a preset:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className="p-2.5 text-left text-xs rounded-xl border border-border bg-card hover:bg-accent/40 transition truncate cursor-pointer"
                >
                  <span className="font-semibold block truncate">{p.label}</span>
                  <span className="text-muted-foreground">{p.kg} kg CO₂e</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="logLabel"
                className="text-xs font-semibold text-muted-foreground block mb-1"
              >
                Activity Label
              </label>
              <input
                id="logLabel"
                type="text"
                required
                placeholder="e.g. Commute to Office"
                value={logLabel}
                onChange={(e) => setLogLabel(e.target.value)}
                className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-primary focus:outline-none rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="logCategory"
                  className="text-xs font-semibold text-muted-foreground block mb-1"
                >
                  Category
                </label>
                <select
                  id="logCategory"
                  value={logCategory}
                  onChange={(e) => setLogCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-primary focus:outline-none rounded-xl text-sm"
                >
                  <option value="transport">Transportation</option>
                  <option value="food">Food</option>
                  <option value="energy">Energy</option>
                  <option value="shopping">Shopping</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="logKg"
                  className="text-xs font-semibold text-muted-foreground block mb-1"
                >
                  Emissions (kg CO₂e)
                </label>
                <input
                  id="logKg"
                  type="number"
                  step="0.1"
                  required
                  placeholder="2.5"
                  value={logKg}
                  onChange={(e) => setLogKg(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-primary focus:outline-none rounded-xl text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 cursor-pointer"
            >
              Save Activity
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
