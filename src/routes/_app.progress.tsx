import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { achievements, monthlyTrend } from "@/lib/mock-data";
import { Sparkles, Target, Leaf, Flame, TreePine, Award } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from "recharts";

const iconMap = { Sparkles, Target, Leaf, Flame } as const;

export const Route = createFileRoute("/_app/progress")({
  head: () => ({ meta: [{ title: "Progress — Carbon Compass" }] }),
  component: Progress,
});

function Progress() {
  const stats = [
    { label: "Carbon saved", value: "228", unit: "kg CO₂e", sub: "vs. last 6 months", tone: "leaf" },
    { label: "Budget adherence", value: "92%", unit: "", sub: "5 of 6 months on track", tone: "primary" },
    { label: "Weekly streak", value: "11", unit: "weeks", sub: "Personal best!", tone: "warning" },
    { label: "Trees equivalent", value: "3.8", unit: "trees", sub: "absorbed CO₂", tone: "moss" },
  ];

  return (
    <AppShell title="Progress & insights" subtitle="Small choices, compounding impact.">
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl bg-card border border-border ring-soft p-5">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-3xl font-semibold tabular-nums">
                {s.value}<span className="text-sm font-sans font-normal text-muted-foreground ml-1">{s.unit}</span>
              </div>
              <div className="mt-1 text-xs text-success font-medium">{s.sub}</div>
            </div>
          ))}
        </section>

        <section className="col-span-12 lg:col-span-8 rounded-3xl bg-card border border-border ring-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Monthly footprint</h3>
            <span className="text-xs text-muted-foreground">kg CO₂e per month</span>
          </div>
          <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
                  cursor={{ fill: "var(--color-accent)" }}
                />
                <Bar dataKey="kg" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 rounded-3xl p-6 ring-soft border border-border text-primary-foreground relative overflow-hidden"
                 style={{ background: "linear-gradient(160deg, var(--color-primary) 0%, var(--color-moss) 100%)" }}>
          <TreePine className="h-6 w-6" />
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">You're outpacing 78% of users in NYC</h3>
          <p className="mt-2 text-sm opacity-90">Keep your weekly streak alive — one more week earns the 30-day badge.</p>
          <div className="mt-6 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white" style={{ width: "78%" }} />
          </div>
          <div className="mt-2 text-xs opacity-90">Day 11 of 30</div>
        </section>

        <section className="col-span-12 rounded-3xl bg-card border border-border ring-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Achievements</h3>
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a) => {
              const Icon = iconMap[a.icon as keyof typeof iconMap];
              return (
                <li key={a.title} className={`rounded-2xl border p-4 ${a.earned ? "bg-accent/40 border-border" : "border-dashed border-border opacity-60"}`}>
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${a.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="mt-3 font-semibold text-sm">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.earned ? "Earned" : "Locked"}</div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
