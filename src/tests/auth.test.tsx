import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/firebase/client", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

import { AuthPage } from "../routes/auth";

describe("AuthPage", () => {
  it("renders the sign in form", () => {
    const { getByText } = render(<AuthPage />);
    expect(getByText(/Welcome back/i)).toBeInTheDocument();
  });
});
