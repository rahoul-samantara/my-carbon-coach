import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { Route as OnboardingRoute } from "@/routes/onboarding";
import { renderWithProviders } from "./test-utils";

const mockNavigate = vi.fn();

vi.mock("@/hooks/use-carbon-data", () => ({
  useCarbonData: () => ({
    saveCarbonProfile: vi.fn().mockResolvedValue(true),
  }),
  CarbonDataProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Onboarding Flow", () => {
  it("allows user to navigate through questions and submit", async () => {
    renderWithProviders(<OnboardingRoute.options.component />);

    const drivingButton = await screen.findByText("Car");
    fireEvent.click(drivingButton);

    const nextButton = screen.getByRole("button", { name: /Continue/i });
    fireEvent.click(nextButton);

    expect(await screen.findByText(/How far do you travel/i)).toBeDefined();
  });
});
