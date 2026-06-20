import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquareHeart,
  SlidersHorizontal,
  LineChart,
  Sprout,
  Bell,
  LogIn,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { type ReactNode } from "react";
import { Logo } from "./Logo";
import { useCarbonData } from "../hooks/use-carbon-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/coach", label: "Carbon Coach", icon: MessageSquareHeart },
  { to: "/simulator", label: "What-If", icon: SlidersHorizontal },
  { to: "/progress", label: "Progress", icon: LineChart },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { carbonProfile, user, signOutUser } = useCarbonData();

  const userDisplayName = user?.user_metadata?.full_name || carbonProfile.name;
  const userInitials =
    userDisplayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AR";

  return (
    <div className="min-h-dvh surface-gradient">
      <div className="mx-auto flex max-w-[1440px] gap-0 lg:gap-6 lg:p-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col rounded-3xl bg-sidebar p-5 ring-soft border border-sidebar-border h-[calc(100dvh-3rem)] sticky top-6">
          <Logo />
          <nav className="mt-8 flex flex-col gap-1" aria-label="Desktop Navigation">
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
            <div className="mt-2 font-display text-2xl font-semibold">
              {carbonProfile.monthlyBudgetKg} kg
            </div>
            <div className="text-xs text-muted-foreground">monthly budget</div>
            <Link
              to="/onboarding"
              className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
            >
              Retake assessment →
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-4 py-6 lg:p-0">
          {/* Mobile top bar */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <Logo />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="User Menu"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-xs font-semibold"
                >
                  {userInitials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-1 rounded-2xl p-2 border border-border bg-card shadow-lg"
              >
                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                  {user ? `Logged in as ${user.email}` : "Guest Mode"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-b border-border" />
                {user ? (
                  <DropdownMenuItem
                    onClick={signOutUser}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/auth" })}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" /> Sign In / Sign Up
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
                {title}
              </h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              {!user && (
                <div className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-full">
                  <ShieldAlert className="h-3.5 w-3.5" /> Offline Mode (Local Storage)
                </div>
              )}
              <button
                aria-label="Notifications"
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent transition"
              >
                <Bell className="h-4 w-4" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-full border border-border bg-card pl-1 pr-4 py-1 hover:bg-accent/30 transition text-left cursor-pointer">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {userInitials}
                    </div>
                    <div className="text-xs">
                      <div className="font-medium truncate max-w-[120px]">{userDisplayName}</div>
                      <div className="text-muted-foreground text-[10px]">
                        {user ? "Cloud Synced" : "Guest User"}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-1 rounded-2xl p-2 border border-border bg-card shadow-lg"
                >
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {user ? `Logged in as ${user.email}` : "Guest Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 border-b border-border" />
                  {user ? (
                    <DropdownMenuItem
                      onClick={signOutUser}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/auth" })}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
                    >
                      <LogIn className="h-4 w-4" /> Sign In / Sign Up
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {children}

          {/* Mobile bottom nav */}
          <nav
            className="lg:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-border bg-card/95 backdrop-blur p-1.5 ring-lift flex justify-around"
            aria-label="Mobile Navigation"
          >
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
