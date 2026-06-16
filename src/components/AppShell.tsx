import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, MessageSquareHeart, SlidersHorizontal, LineChart, Sprout, Bell } from "lucide-react";
import { type ReactNode } from "react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/coach", label: "Carbon Coach", icon: MessageSquareHeart },
  { to: "/simulator", label: "What-If", icon: SlidersHorizontal },
  { to: "/progress", label: "Progress", icon: LineChart },
] as const;

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh surface-gradient">
      <div className="mx-auto flex max-w-[1440px] gap-0 lg:gap-6 lg:p-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col rounded-3xl bg-sidebar p-5 ring-soft border border-sidebar-border h-[calc(100dvh-3rem)] sticky top-6">
          <Logo />
          <nav className="mt-8 flex flex-col gap-1" aria-label="Primary">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-sidebar-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sprout className="h-4 w-4 text-leaf" />
              Carbon Profile
            </div>
            <div className="mt-2 font-display text-2xl font-semibold">580 kg</div>
            <div className="text-xs text-muted-foreground">monthly budget</div>
            <Link to="/onboarding" className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
              Retake assessment →
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-4 py-6 lg:p-0">
          {/* Mobile top bar */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <Logo />
            <button aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card">
              <Bell className="h-4 w-4" />
            </button>
          </div>

          <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <button aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent transition">
                <Bell className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 rounded-full border border-border bg-card pl-1 pr-4 py-1">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">AR</div>
                <div className="text-xs">
                  <div className="font-medium">Alex Rivera</div>
                  <div className="text-muted-foreground">Brooklyn</div>
                </div>
              </div>
            </div>
          </header>

          {children}

          {/* Mobile bottom nav */}
          <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-border bg-card/95 backdrop-blur p-1.5 ring-lift flex justify-around" aria-label="Primary">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label.split(" ")[0]}
                </Link>
              );
            })}
          </nav>
          <div className="lg:hidden h-20" />
        </main>
      </div>
    </div>
  );
}
