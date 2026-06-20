import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ children, to, ...props }: Record<string, unknown>) =>
      React.createElement("a", { href: to as string, ...props }, children as React.ReactNode),
    useRouter: () => ({ navigate: vi.fn(), state: { location: { pathname: "/" } }, options: {} }),
    useRouterState: (opts: Record<string, unknown>) =>
      opts?.select
        ? (opts.select as (state: Record<string, unknown>) => unknown)({
            location: { pathname: "/" },
          })
        : { location: { pathname: "/" } },
    useNavigate: () => vi.fn(),
    useMatches: () => [],
    useMatch: () => ({ routeId: "/" }),
    useLinkProps: () => ({ href: "/" }),
  };
});

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  writeBatch: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true, forEach: () => {}, docs: [] }),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
}));
