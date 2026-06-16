import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Car, Train, UtensilsCrossed, Home, Lightbulb } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_app/simulator")({
  head: () => ({ meta: [{ title: "What-If Simulator — Carbon Compass" }] }),
  component: Simulator;
});

type Lever = { key: string; label: string; unit: string; max: number; default: number; perUnitKg: number; icon: typeof Car; hint: string };

const levers: Lever[] = [
  { key: "transit", label: "Subway days per week", unit: "days", max: 5, default: 1, perUnitKg: -4.2, icon: Train, hint: "Replace solo car commutes with the subway." },
  { key: "car", label: "Car trips per week", unit: "trips", max: 10, default: 6, perUnitKg: 3.6, icon: Car, hint: "Single-occupancy driving emissions." },
  { key: "delivery", label: "Food deliveries per week", unit: "orders", max: 10, default: 4, perUnitKg: 1.8, icon: UtensilsCrossed, hint: "Includes packaging + last-mile." },
  { key: "wfh", label: "Work-from-home days", unit: "days", max: 5, default: 2, perUnitKg: -2.1, icon: Home, hint: "Avoided commute, partial office energy." },
];

function Simulator() {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(levers.map((l) => [l.key, l.default]))
  );

  const baseline = useMemo(() => levers.reduce((sum, l) => sum + l.default * l.perUnitKg, 0), []);
  const projected = useMemo(() => levers.reduce((sum, l) => sum + values[l.key] * l.perUnitKg, 0), [values]);
  const weeklyDelta = projected - baseline;
  const monthlyDelta = weeklyDelta * 4.33;
  const annualDelta = weeklyDelta * 52;

  const better = monthlyDelta < 0;

  return (
    <AppShell title="What-If Simulator" subtitle="Try small changes. See the impact instantly.">
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 lg:col-span-7 rounded-3xl bg-card border border-border ring-soft p-6 space-y-6">
          {levers.map((l) => {
            const Icon = l.icon;
            return (
              <div key={l.key}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <label htmlFor={l.key} className="font-medium block truncate">{l.label}</label>
                      <div className="text-xs text-muted-foreground">{l.hint}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-2xl font-semibold tabular-nums">{values[l.key]}</div>
                    <div className="text-xs text-muted-foreground">{l.unit}/wk</div>
                  </div>
                </div>
                <input
                  id={l.key}
                  type="range"
                  min={0}
                  max={l.max}
                  step={1}
                  value={values[l.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [l.key]: Number(e.target.value) }))}
                  className="mt-3 w-full accent-primary"
                  aria-label={l.label}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0</span><span>{l.max}</span>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setValues(Object.fromEntries(levers.map((l) => [l.key, l.default])))}
            className="text-xs text-primary font-medium hover:underline"
          >
            Reset to current habits
          </button>
        </section>

        <aside className="col-span-12 lg:col-span-5 space-y-4">
          <div className={`rounded-3xl p-6 ring-lift border ${better ? "border-success/30" : "border-destructive/30"} relative overflow-hidden`}
               style={{ background: better
                 ? "linear-gradient(135deg, color-mix(in oklab, var(--color-success) 12%, var(--color-card)), var(--color-card))"
                 : "linear-gradient(135deg, color-mix(in oklab, var(--color-destructive) 10%, var(--color-card)), var(--color-card))" }}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Projected change</div>
            <div className={`mt-2 font-display text-5xl font-semibold tabular-nums ${better ? "text-success" : "text-destructive"}`}>
              {monthlyDelta >= 0 ? "+" : ""}{monthlyDelta.toFixed(1)}
              <span className="text-base font-sans text-muted-foreground font-normal"> kg/mo</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {better ? "Below" : "Above"} your current trajectory.
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-card/70 border border-border p-3">
                <dt className="text-xs text-muted-foreground">Weekly</dt>
                <dd className="font-display text-xl font-semibold tabular-nums">{weeklyDelta >= 0 ? "+" : ""}{weeklyDelta.toFixed(1)} kg</dd>
              </div>
              <div className="rounded-2xl bg-card/70 border border-border p-3">
                <dt className="text-xs text-muted-foreground">Annual</dt>
                <dd className="font-display text-xl font-semibold tabular-nums">{annualDelta >= 0 ? "+" : ""}{annualDelta.toFixed(0)} kg</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-card border border-border ring-soft p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h3 className="font-semibold text-sm">Try this combo</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Subway 3×/week + 1 fewer delivery + 1 extra WFH day saves an estimated <span className="text-foreground font-semibold">38 kg CO₂e/mo</span> — that's nearly 7% of your budget.
            </p>
            <button
              onClick={() => setValues({ transit: 3, car: 4, delivery: 3, wfh: 3 })}
              className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              Apply combo
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
