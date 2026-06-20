import { createMiddleware } from "@tanstack/react-start";
import { auth } from "./client";

export const attachFirebaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token: string | undefined;
    const user = auth.currentUser;
    if (user) {
      try {
        token = await user.getIdToken();
      } catch (error) {
        console.error("Failed to get Firebase ID token:", error);
      }
    } else {
      // For mock session
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("carbon_mock_user_id") : null;
      if (stored) {
        token = `mock-token-${stored}`;
      }
    }

    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
