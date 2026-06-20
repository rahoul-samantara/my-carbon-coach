import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BudgetHero } from "@/components/dashboard/BudgetHero";
import { ImpactBreakdown } from "@/components/dashboard/ImpactBreakdown";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { renderWithProviders } from "./test-utils";

describe("Dashboard Components", () => {
  it("renders BudgetHero and triggers log modal on click", () => {
    const mockOnLogClick = vi.fn();
    renderWithProviders(
      <BudgetHero
        name="Test User"
        monthlyBudgetKg={1000}
        usedKg={450}
        remainingKg={550}
        pct={45}
        dash={100}
        circumference={200}
        onLogClick={mockOnLogClick}
      />,
    );

    expect(screen.getByText("450")).toBeDefined();

    const logButton = screen.getByRole("button", { name: /Log Activity/i });
    fireEvent.click(logButton);
    expect(mockOnLogClick).toHaveBeenCalledTimes(1);
  });

  it("renders ImpactBreakdown with categories", () => {
    const mockCategories = [
      {
        key: "transport",
        label: "Transport",
        color: "blue",
        usedKg: 100,
        budgetKg: 200,
        impact: "Medium" as const,
      },
    ];

    renderWithProviders(<ImpactBreakdown categories={mockCategories} />);
    expect(screen.getByText(/Impact breakdown/i)).toBeDefined();
    expect(screen.getByText("Transport")).toBeDefined();
    expect(screen.getByText("100")).toBeDefined();
  });

  it("renders GoalsSection with weekly goals", () => {
    const mockGoals = [
      { id: "1", title: "Walk to work", progress: 50, reward: "50 pts", completed: false },
    ];

    // Using renderWithProviders to mock the <Link> component from TanStack router
    renderWithProviders(<GoalsSection goals={mockGoals} />);
    expect(screen.getByText("Weekly goals")).toBeDefined();
    expect(screen.getByText("Walk to work")).toBeDefined();
    expect(screen.getByText("50%")).toBeDefined();
  });

  it("renders RecentActivities with items", () => {
    const mockActivities = [
      {
        id: "1",
        label: "Bus ride",
        category: "transport",
        kg: 2.5,
        created_at: "2023-01-01",
        when: "Today",
      },
    ];
    const mockCategories = [
      {
        key: "transport",
        label: "Transport",
        color: "blue",
        usedKg: 100,
        budgetKg: 200,
        impact: "Medium" as const,
      },
    ];

    renderWithProviders(
      <RecentActivities recentActivity={mockActivities} categories={mockCategories} />,
    );
    expect(screen.getByText(/Recent activity/i)).toBeDefined();
    expect(screen.getByText("Bus ride")).toBeDefined();
    expect(screen.getByText("2.5 kg")).toBeDefined();
  });
});
