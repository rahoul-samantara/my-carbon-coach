import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { Route as CoachRoute } from "@/routes/_app.coach";
import { renderWithProviders } from "./test-utils";

vi.mock("@/hooks/use-carbon-data", () => ({
  useCarbonData: () => ({
    carbonProfile: {
      name: "Test User",
    },
  }),
  CarbonDataProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the TanStack server function
vi.mock("@/lib/api/coach.functions", () => ({
  askCoach: vi.fn().mockResolvedValue({
    message: "Here is your plan.",
    cards: [{ icon: "Leaf", title: "Go Vegan", detail: "Eat plants", impact: "High" }],
  }),
}));

describe("AI Coach UI", () => {
  it("allows user to type a question and submit", async () => {
    renderWithProviders(<CoachRoute.options.component />);

    expect(screen.getAllByText(/Carbon Coach/i).length).toBeGreaterThan(0);

    const input = screen.getByPlaceholderText(/Ask anything about your footprint/i);
    const submitButton = screen.getByRole("button", { name: "Send" });

    fireEvent.change(input, { target: { value: "How do I reduce my footprint?" } });
    fireEvent.click(submitButton);

    // Fire submit event
    fireEvent.submit(input);

    // Assert form is disabled while typing
    expect(submitButton).toBeDisabled();
  });
});
