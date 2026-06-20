import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock("@/components/AppShell", () => ({
  AppShell: ({ children }: any) => <div data-testid="app-shell">{children}</div>,
}));

vi.mock("@/hooks/use-carbon-data", () => ({
  useCarbonData: () => ({
    carbonProfile: { name: "Test User", monthlyBudgetKg: 100, usedKg: 50, remainingKg: 50 },
    categories: [],
    monthlyTrend: [],
    weeklyGoals: [],
    recentActivity: [],
    logNewActivity: vi.fn(),
    loading: false,
  }),
  CarbonDataProvider: ({ children }: any) => <>{children}</>,
}));

import { Dashboard } from "../routes/_app.index";

describe("Dashboard Route", () => {
  it("renders the dashboard when not loading", () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId("app-shell")).toBeInTheDocument();
  });
});
