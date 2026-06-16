import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { suggestedQuestions } from "@/lib/mock-data";
import { Send, Sparkles, Leaf, Bike, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/coach")({
  head: () => ({ meta: [{ title: "Carbon Coach — Carbon Compass" }] }),
  component: Coach,
});

type Msg = { role: "user" | "assistant"; text: string; cards?: { icon: string; title: string; detail: string; impact: string }[] };

const initial: Msg[] = [
  {
    role: "assistant",
    text: "Hi Alex 👋 I looked at your last 30 days. Transportation is your biggest contributor at 48% of your footprint. Here are three high-impact changes I'd suggest for this week:",
    cards: [
      { icon: "Bike", title: "Bike to work 2 days", detail: "Replaces 14 km of solo car commute", impact: "−8.4 kg CO₂e/week" },
      { icon: "UtensilsCrossed", title: "Skip one delivery", detail: "Cook one weeknight dinner at home", impact: "−3.1 kg CO₂e/week" },
      { icon: "Leaf", title: "Two plant-based lunches", detail: "Beans + grains over red meat", impact: "−4.2 kg CO₂e/week" },
    ],
  },
];

const iconMap = { Bike, UtensilsCrossed, Leaf, Sparkles } as const;

function Coach() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: "Great question. Based on your profile, your single biggest lever is shifting 2 car commutes per week to the subway — that alone would save roughly 32 kg CO₂e per month, putting you ~11% under budget. Want me to add it as a weekly goal?" },
    ]);
    setInput("");
  }

  return (
    <AppShell title="Carbon Coach" subtitle="A personal advisor for your footprint — powered by your profile.">
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 lg:col-span-8 rounded-3xl bg-card border border-border ring-soft flex flex-col min-h-[68dvh]">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf/15 text-leaf">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="font-semibold text-sm">Coach</div>
              <div className="text-xs text-muted-foreground">Personalized to your profile · always private</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${m.role === "user" ? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-3" : "space-y-3"}`}>
                  <div className={m.role === "assistant" ? "text-foreground" : ""}>{m.text}</div>
                  {m.cards && (
                    <div className="grid sm:grid-cols-3 gap-3">
                      {m.cards.map((c) => {
                        const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Sparkles;
                        return (
                          <div key={c.title} className="rounded-2xl border border-border bg-background/60 p-4">
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="mt-3 font-semibold text-sm">{c.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{c.detail}</div>
                            <div className="mt-3 text-xs font-semibold text-success">{c.impact}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-4 flex items-center gap-2"
          >
            <label htmlFor="ask" className="sr-only">Ask the coach</label>
            <input
              id="ask"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your footprint…"
              className="flex-1 rounded-full bg-muted border border-transparent focus:border-ring focus:outline-none px-4 py-2.5 text-sm"
            />
            <button type="submit" aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-card border border-border ring-soft p-6">
            <h3 className="font-display text-lg font-semibold">Suggested questions</h3>
            <ul className="mt-3 space-y-2">
              {suggestedQuestions.map((q) => (
                <li key={q}>
                  <button onClick={() => send(q)} className="w-full text-left text-sm rounded-2xl border border-border px-4 py-3 hover:bg-accent/40 transition">
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl p-6 ring-soft border border-border" style={{ background: "linear-gradient(135deg, var(--color-leaf) 0%, var(--color-moss) 100%)", color: "white" }}>
            <Sparkles className="h-5 w-5" />
            <h3 className="mt-3 font-display text-xl font-semibold">Insight of the day</h3>
            <p className="mt-2 text-sm opacity-95">
              Swapping just 30% of your weekly car trips to subway could save 380 kg CO₂e per year — equivalent to planting 6 mature trees.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
