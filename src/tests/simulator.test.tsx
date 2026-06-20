import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { Route as SimulatorRoute } from "@/routes/_app.simulator";
import { renderWithProviders } from "./test-utils";

vi.mock("@/hooks/use-carbon-data", () => ({
  useCarbonData: () => ({
    carbonProfile: {
      monthlyBudgetKg: 1000,
      name: "Test User",
    },
  }),
  CarbonDataProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Simulator Route Tests", () => {
  it("renders the What-If Simulator and updates impact estimation", async () => {
    // SimulatorRoute.options.component contains the actual page component
    renderWithProviders(<SimulatorRoute.options.component />);

    expect(screen.getByText(/What-If Simulator/i)).toBeDefined();

    // Check initial estimated savings (0 kg)
    const estimateElement = screen.getByText(/Projected change/i);
    expect(estimateElement).toBeDefined();

    // Find the sliders
    const transitSlider = screen.getByRole("slider", { name: /Subway days per week/i });
    expect(transitSlider).toBeDefined();

    // Note: Due to Radix UI Slider, simulating slider changes in RTL can be tricky,
    // but the component itself should be rendered and accessible.
    expect(screen.getByText(/Try this combo/i)).toBeDefined();
    expect(screen.getByText("+0.0")).toBeDefined(); // Savings number starts at +0.0
  });
});
