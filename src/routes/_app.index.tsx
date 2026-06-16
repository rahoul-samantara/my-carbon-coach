import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { categories, carbonProfile, monthlyTrend, weeklyGoals, recentActivity } from "@/lib/mock-data";
import { ArrowUpRight, Plus, MessageSquareHeart, SlidersHorizontal, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Carbon Compass" },
      { name: "description", content: "Your monthly carbon budget, impact breakdown, and weekly goals at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { monthlyBudgetKg, usedKg, remainingKg } = carbonProfile;
  const pct = Math.round((usedKg / monthlyBudgetKg) * 100);
  const circumference = 2 * Math.PI * 80;
  const dash = (pct / 100) * circumference;

  return (
    <AppShell title="Good morning, Alex" subtitle="You're on pace to come in 12% under budget this month.">
      <div className="grid grid-cols-12 gap-4">
        {/* Carbon Budget hero */}
        <section className="col-span-12 lg:col-span-8 rounded-3xl bg-card border border-border ring-soft p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-leaf/15 blur-3xl" aria-hidden />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 relative">
            <div className="relative shrink-0">
              <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
                <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-muted)" strokeWidth="14" />
                <circle
                  cx="100" cy="100" r="80" fill="none"
                  stroke="var(--color-primary)" strokeWidth="14" strokeLinecap="round"
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
                <TrendingDown className="h-3.5 w-3.5" /> 17% below February
              </div>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold">
                {usedKg} <span className="text-muted-foreground font-sans text-base font-normal">kg CO₂e used</span>
              </h2>
              <div className="mt-1 text-sm text-muted-foreground">
                {remainingKg} kg remaining of {monthlyBudgetKg} kg this month
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition">
                  <Plus className="h-4 w-4" /> Log activity
                </button>
                <Link to="/coach" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition">
                  <MessageSquareHeart className="h-4 w-4" /> Ask coach
                </Link>
                <Link to="/simulator" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition">
                  <SlidersHorizontal className="h-4 w-4" /> Simulate
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trend chart */}
        <section className="col-span-12 lg:col-span-4 rounded-3xl bg-card border border-border ring-soft p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">6-month trend</h3>
            <span className="text-xs text-muted-foreground">kg CO₂e</span>
          </div>
          <div className="mt-4 h-44 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
                  cursor={{ stroke: "var(--color-border)" }}
                />
                <Area type="monotone" dataKey="kg" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#trend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-success font-medium">Down 33% since October ↓</div>
        </section>

        {/* Impact breakdown */}
        <section className="col-span-12 lg:col-span-7 rounded-3xl bg-card border border-border ring-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Impact breakdown</h3>
            <span className="text-xs text-muted-foreground">this month</span>
          </div>
          <ul className="space-y-4">
            {categories.map((c) => {
              const p = Math.round((c.usedKg / c.budgetKg) * 100);
              return (
                <li key={c.key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="font-medium truncate">{c.label}</span>
                      <span className={`text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 ${
                        c.impact === "High" ? "bg-destructive/10 text-destructive" :
                        c.impact === "Medium" ? "bg-warning/15 text-warning-foreground" :
                        "bg-success/10 text-success"
                      }`}>{c.impact}</span>
                    </div>
                    <div className="text-sm tabular-nums text-muted-foreground shrink-0">
                      <span className="text-foreground font-semibold">{c.usedKg}</span> / {c.budgetKg} kg
                    </div>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: c.color }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Weekly goals */}
        <section className="col-span-12 lg:col-span-5 rounded-3xl bg-card border border-border ring-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Weekly goals</h3>
            <Link to="/progress" className="text-xs text-primary font-medium inline-flex items-center gap-1">All <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <ul className="space-y-3">
            {weeklyGoals.map((g) => (
              <li key={g.title} className="rounded-2xl border border-border p-4 hover:bg-accent/40 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm">{g.title}</div>
                  <span className="text-[11px] font-semibold text-success rounded-full bg-success/10 px-2 py-0.5 shrink-0">{g.reward}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${g.progress}%` }} />
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{g.progress}%</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent activity */}
        <section className="col-span-12 rounded-3xl bg-card border border-border ring-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Recent activity</h3>
            <button className="text-xs text-primary font-medium">View log</button>
          </div>
          <ul className="divide-y divide-border">
            {recentActivity.map((a) => {
              const cat = categories.find((c) => c.key === a.category)!;
              return (
                <li key={a.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-9 w-9 rounded-xl grid place-items-center text-xs font-semibold shrink-0" style={{ background: `color-mix(in oklab, ${cat.color} 18%, transparent)`, color: cat.color }}>
                      {cat.label[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{a.label}</div>
                      <div className="text-xs text-muted-foreground">{a.when} · {cat.label}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums shrink-0">{a.kg.toFixed(1)} kg</div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
