import React, { ReactNode } from "react";
import { render } from "@testing-library/react";
import { CarbonDataProvider } from "@/hooks/use-carbon-data";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { vi } from "vitest";

// Mock out the firebase client/server imports
vi.mock("@/integrations/firebase/client", () => ({
  db: {},
  auth: { currentUser: { uid: "test-user", email: "test@example.com" } },
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb({ uid: "test-user", email: "test@example.com", user_metadata: { full_name: "Test User" } });
    return () => {};
  }),
}));

export function renderWithProviders(ui: ReactNode) {
  return render(<CarbonDataProvider>{ui}</CarbonDataProvider>);
}
