import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Bike, Bus, Car, Train, Leaf, Beef, Salad, Home, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCarbonData, calculateBudget } from "@/hooks/use-carbon-data";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get started — Carbon Compass" }] }),
  component: Onboarding,
});

type Answers = {
  commute?: string;
  distance?: number;
  diet?: string;
  household?: number;
  shopping?: string;
  wfh?: number;
};

const steps = [
  { key: "commute", title: "How do you usually get around?", subtitle: "Pick your most-used commute mode." },
  { key: "distance", title: "How far do you travel each week?", subtitle: "All commute distances combined." },
  { key: "diet", title: "What does your plate look like?", subtitle: "Roughly — we'll fine-tune later." },
  { key: "household", title: "Who's at home?", subtitle: "Household size helps allocate energy." },
  { key: "shopping", title: "How often do you shop online?", subtitle: "Includes deliveries and returns." },
  { key: "wfh", title: "Work-from-home days per week?", subtitle: "We'll factor in avoided commutes." },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const { saveOnboarding } = useCarbonData();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [a, setA] = useState<Answers>({ distance: 60, household: 2, wfh: 2 });

  const progress = ((step + 1) / steps.length) * 100;
  const current = steps[step];

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
    else setDone(true);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  const handleComplete = async () => {
    await saveOnboarding(a);
    navigate({ to: "/" });
  };

  if (done) return <Result answers={a} onContinue={handleComplete} />;

  return (
    <div className="min-h-dvh surface-gradient flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-5xl w-full mx-auto">
        <Logo />
        <button onClick={() => navigate({ to: "/" })} className="text-xs text-muted-foreground hover:text-foreground">
          Skip for now
        </button>
      </header>

      <div className="max-w-5xl w-full mx-auto px-6 flex-1 flex flex-col">
        <div className="mt-2 mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding step completion progress">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border ring-soft p-8 sm:p-12 flex-1">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight max-w-2xl">{current.title}</h1>
          <p className="mt-2 text-muted-foreground">{current.subtitle}</p>

          <div className="mt-10">
            {current.key === "commute" && (
              <ChoiceGrid
                value={a.commute}
                onChange={(v) => setA({ ...a, commute: v })}
                options={[
                  { v: "car", label: "Car", icon: Car },
                  { v: "transit", label: "Subway / Bus", icon: Train },
                  { v: "bike", label: "Bike / Walk", icon: Bike },
                  { v: "rideshare", label: "Rideshare", icon: Bus },
                ]}
              />
            )}
            {current.key === "distance" && (
              <Slider
                value={a.distance ?? 60}
                onChange={(v) => setA({ ...a, distance: v })}
                min={0} max={300} step={5} unit="km/week"
              />
            )}
            {current.key === "diet" && (
              <ChoiceGrid
                value={a.diet}
                onChange={(v) => setA({ ...a, diet: v })}
                options={[
                  { v: "meat", label: "Meat most days", icon: Beef },
                  { v: "flexitarian", label: "Flexitarian", icon: Salad },
                  { v: "vegetarian", label: "Vegetarian", icon: Leaf },
                  { v: "vegan", label: "Vegan", icon: Leaf },
                ]}
              />
            )}
            {current.key === "household" && (
              <Slider value={a.household ?? 2} onChange={(v) => setA({ ...a, household: v })} min={1} max={6} step={1} unit="people" />
            )}
            {current.key === "shopping" && (
              <ChoiceGrid
                value={a.shopping}
                onChange={(v) => setA({ ...a, shopping: v })}
                options={[
                  { v: "rare", label: "Rarely", icon: ShoppingBag },
                  { v: "monthly", label: "A few times a month", icon: ShoppingBag },
                  { v: "weekly", label: "Weekly", icon: ShoppingBag },
                  { v: "often", label: "Several times a week", icon: ShoppingBag },
                ]}
              />
            )}
            {current.key === "wfh" && (
              <Slider value={a.wfh ?? 2} onChange={(v) => setA({ ...a, wfh: v })} min={0} max={5} step={1} unit="days/week" icon={Home} />
            )}
          </div>

          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-border bg-card disabled:opacity-40 hover:bg-accent transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90"
            >
              {step === steps.length - 1 ? "See my profile" : "Continue"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-8" />
    </div>
  );
}

function ChoiceGrid({ options, value, onChange }: {
  options: { v: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {options.map((o) => {
        const Icon = o.icon;
        const active = value === o.v;
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`rounded-2xl border p-5 text-left transition ${
              active ? "border-primary bg-accent/60 ring-2 ring-primary/30" : "border-border bg-card hover:bg-accent/30"
            }`}
            aria-pressed={active}
          >
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="mt-3 font-medium text-sm">{o.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function Slider({ value, onChange, min, max, step, unit, icon: Icon }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <div className="font-display text-6xl font-semibold tabular-nums flex items-center justify-center gap-3">
        {Icon && <Icon className="h-8 w-8 text-leaf" />}
        {value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{unit}</div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-8 w-full accent-primary"
        aria-label={unit}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function Result({ answers, onContinue }: { answers: Answers; onContinue: () => void }) {
  const scores = calculateBudget(answers);
  
  const summary = [
    { label: "Transportation", impact: scores.transScore > 150 ? "High" : scores.transScore > 80 ? "Medium" : "Low", color: "var(--chart-1)", note: scores.transScore > 150 ? "Your largest contributor — biggest opportunity." : "Great, transportation emissions are low!" },
    { label: "Food", impact: scores.foodScore > 150 ? "High" : scores.foodScore > 80 ? "Medium" : "Low", color: "var(--chart-2)", note: answers.diet === "meat" ? "A shift toward flexitarian could save ~15%." : "Excellent diet selection." },
    { label: "Energy", impact: scores.energyScore > 100 ? "High" : scores.energyScore > 50 ? "Medium" : "Low", color: "var(--chart-3)", note: `Household sizing of ${answers.household || 1} offsets baseline energy.` },
    { label: "Shopping", impact: scores.shopScore > 80 ? "High" : scores.shopScore > 40 ? "Medium" : "Low", color: "var(--chart-4)", note: "Ordering in bundles reduces packaging impact." },
  ];

  return (
    <div className="min-h-dvh surface-gradient flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-success text-success-foreground ring-soft">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold leading-tight">Your Carbon Profile</h1>
          <p className="mt-3 text-muted-foreground">Initial budget set to <span className="font-semibold text-foreground">{scores.monthlyBudget} kg CO₂e / month</span>.</p>
        </div>

        <ul className="mt-10 space-y-3">
          {summary.map((s) => (
            <li key={s.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 ring-soft">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ background: s.color }} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.note}</div>
              </div>
              <span className={`text-[11px] uppercase tracking-wider rounded-full px-2.5 py-1 font-semibold ${
                s.impact === "High" ? "bg-destructive/10 text-destructive" :
                s.impact === "Medium" ? "bg-warning/15 text-warning-foreground" :
                "bg-success/10 text-success"
              }`}>{s.impact}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onContinue}
          className="mt-10 w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-medium hover:opacity-90"
        >
          Go to my dashboard <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

