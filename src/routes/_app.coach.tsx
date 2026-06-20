import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { suggestedQuestions } from "@/lib/mock-data";
import {
  Send,
  Sparkles,
  Leaf,
  Bike,
  UtensilsCrossed,
  Train,
  Home,
  Loader2,
  Mic,
  Volume2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCarbonData } from "@/hooks/use-carbon-data";
import { askCoach } from "@/lib/api/coach.functions";

export const Route = createFileRoute("/_app/coach")({
  head: () => ({ meta: [{ title: "Carbon Coach — Carbon Compass" }] }),
  component: Coach,
});

type Msg = {
  role: "user" | "assistant";
  text: string;
  sentiment?: "positive" | "negative" | "neutral";
  action_plan?: string[];
  cards?: { icon: string; title: string; detail: string; impact: string }[];
};

const iconMap = { Bike, UtensilsCrossed, Leaf, Sparkles, Train, Home } as const;

function Coach() {
  const { carbonProfile } = useCarbonData();
  const userName = carbonProfile.name ? carbonProfile.name.split(" ")[0] : "there";

  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      role: "assistant",
      text: `Hi ${userName} 👋 I looked at your profile details. Based on your inputs, here are three high-impact suggestions I'd recommend starting with:`,
      action_plan: [
        "Review your suggestions",
        "Pick one habit to change",
        "Log your first activity",
      ],
      cards: [
        {
          icon: "Bike",
          title: "Bike to work 2 days",
          detail: "Replaces 14 km of solo car commute",
          impact: "−8.4 kg CO₂e/week",
        },
        {
          icon: "UtensilsCrossed",
          title: "Skip one delivery",
          detail: "Cook one weeknight dinner at home",
          impact: "−3.1 kg CO₂e/week",
        },
        {
          icon: "Leaf",
          title: "Two plant-based lunches",
          detail: "Beans + grains over red meat",
          impact: "−4.2 kg CO₂e/week",
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Web Speech API for Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  async function send(text: string) {
    if (!text.trim() || isTyping) return;
    setInput("");

    setMessages((m) => [...m, { role: "user", text }]);
    setIsTyping(true);

    try {
      const res = await askCoach({
        data: {
          question: text,
          profile: {
            monthlyBudgetKg: carbonProfile.monthlyBudgetKg,
            usedKg: carbonProfile.usedKg,
            remainingKg: carbonProfile.remainingKg,
            answers: carbonProfile.answers,
          },
        },
      });

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: res.text,
          sentiment: res.sentiment as Msg["sentiment"],
          action_plan: res.action_plan as Msg["action_plan"],
          cards: res.cards,
        },
      ]);

      speakText(res.text);
    } catch (err) {
      console.error(err);
      const fallbackText =
        "I couldn't reach my cloud system, but based on your local profile, I suggest reducing commutes by 20% to save approximately 25 kg CO₂e per month.";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: fallbackText,
        },
      ]);
      speakText(fallbackText);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <AppShell
      title="Carbon Coach"
      subtitle="A personal advisor for your footprint — powered by your profile."
    >
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 lg:col-span-8 rounded-3xl bg-card border border-border ring-soft flex flex-col min-h-[68dvh]">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf/15 text-leaf">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="font-semibold text-sm">Coach</div>
              <div className="text-xs text-muted-foreground">
                Personalized to your profile · always private
              </div>
            </div>
            <div className="ml-auto flex items-center">
              <button
                onClick={() => speakText("Voice synthesis is active")}
                title="Test Speech"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted text-muted-foreground"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5" aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] ${
                    m.role === "user"
                      ? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-3"
                      : "space-y-3"
                  }`}
                >
                  <div
                    className={
                      m.role === "assistant"
                        ? `rounded-2xl px-4 py-3 border ${
                            m.sentiment === "positive"
                              ? "bg-success/10 border-success/20 text-foreground"
                              : m.sentiment === "negative"
                                ? "bg-destructive/10 border-destructive/20 text-foreground"
                                : "bg-muted/30 border-transparent text-foreground"
                          }`
                        : ""
                    }
                  >
                    {m.text}
                  </div>

                  {m.action_plan && m.action_plan.length > 0 && (
                    <div className="bg-accent/40 rounded-2xl p-4 border border-border mt-3">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" /> Action Plan
                      </h4>
                      <ul className="text-sm space-y-1 pl-6 list-disc text-muted-foreground">
                        {m.action_plan.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.cards && (
                    <div className="grid sm:grid-cols-3 gap-3">
                      {m.cards.map((c) => {
                        const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Sparkles;
                        return (
                          <div
                            key={c.title}
                            className="rounded-2xl border border-border bg-background/60 p-4"
                          >
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="mt-3 font-semibold text-sm">{c.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{c.detail}</div>
                            <div className="mt-3 text-xs font-semibold text-success">
                              {c.impact}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 text-muted-foreground text-sm bg-accent/30 px-4 py-2.5 rounded-2xl">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Analyzing footprint...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-4 flex items-center gap-2"
          >
            <label htmlFor="ask" className="sr-only">
              Ask the coach
            </label>
            <button
              type="button"
              onClick={toggleListening}
              className={`grid h-10 w-10 place-items-center rounded-full transition-colors cursor-pointer ${
                isListening
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              title="Use Voice (Speech to Text)"
            >
              <Mic className="h-4 w-4" />
            </button>
            <input
              id="ask"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask anything about your footprint…"}
              disabled={isTyping || isListening}
              className="flex-1 rounded-full bg-muted border border-transparent focus:border-ring focus:outline-none px-4 py-2.5 text-sm disabled:opacity-55"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              aria-label="Send"
              className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
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
                  <button
                    onClick={() => send(q)}
                    disabled={isTyping}
                    className="w-full text-left text-sm rounded-2xl border border-border px-4 py-3 hover:bg-accent/40 transition disabled:opacity-50 cursor-pointer"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-3xl p-6 ring-soft border border-border"
            style={{
              background: "linear-gradient(135deg, var(--color-leaf) 0%, var(--color-moss) 100%)",
              color: "white",
            }}
          >
            <Sparkles className="h-5 w-5" />
            <h3 className="mt-3 font-display text-xl font-semibold">Insight of the day</h3>
            <p className="mt-2 text-sm opacity-95">
              Swapping just 30% of your weekly car trips to subway could save 380 kg CO₂e per year —
              equivalent to planting 6 mature trees.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
