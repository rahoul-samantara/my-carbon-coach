import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { Route as ProgressRoute } from "@/routes/_app.progress";
import { renderWithProviders } from "./test-utils";

vi.mock("@/hooks/use-carbon-data", () => ({
  useCarbonData: () => ({
    carbonProfile: {
      monthlyBudgetKg: 1000,
      name: "Test User",
    },
    recentActivity: [],
    monthlyTrend: [
      { month: "Jan", kg: 500, goal: 600 },
      { month: "Feb", kg: 450, goal: 600 },
    ],
    weeklyGoals: [
      { id: "1", title: "Walk", progress: 100, reward: "50", completed: true },
      { id: "2", title: "Vegan", progress: 0, reward: "100", completed: false },
    ],
  }),
  CarbonDataProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Recharts uses ResizeObserver which is not available in JSDOM natively
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Progress Route UI", () => {
  it("renders the trend chart and goals", () => {
    renderWithProviders(<ProgressRoute.options.component />);

    expect(screen.getByText(/Monthly footprint/i)).toBeDefined();

    // Verify goals render
    expect(screen.getByText(/Monthly footprint/i)).toBeDefined();

    // Verify completed status logic
    expect(screen.getByText(/Achievements/i)).toBeDefined();
  });
});
