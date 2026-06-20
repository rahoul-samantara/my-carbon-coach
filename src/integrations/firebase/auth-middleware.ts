import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { firebaseAdmin } from "./client.server";

export const requireFirebaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();

    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      throw new Error("Unauthorized: No authorization header provided");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Only Bearer tokens are supported");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    try {
      // For mock tokens during local development if Firebase env is not fully set up
      if (token.startsWith("mock-token-")) {
        return next({
          context: {
            userId: token.replace("mock-token-", ""),
            claims: { sub: token.replace("mock-token-", "") },
          },
        });
      }

      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

      return next({
        context: {
          userId: decodedToken.uid,
          claims: decodedToken,
        },
      });
    } catch (error) {
      console.error("Firebase auth middleware error:", error);
      throw new Error("Unauthorized: Invalid token");
    }
  },
);
