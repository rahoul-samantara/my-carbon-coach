import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/Logo";

describe("App UI tests", () => {
  it("renders the Logo component successfully", () => {
    render(<Logo />);
    // The logo renders the text "Carbon Compass"
    expect(screen.getByText("Carbon Compass")).toBeDefined();
  });
});
