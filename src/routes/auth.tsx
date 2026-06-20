import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "@/integrations/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Logo } from "@/components/Logo";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Access Carbon Compass" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast.success("Registration successful! Welcome to Carbon Compass.");
        navigate({ to: "/onboarding" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Successfully logged in.");
        navigate({ to: "/" });
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An authentication error occurred.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh surface-gradient flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <header className="mb-8 text-center flex flex-col items-center">
          <Logo className="mb-4" />
          <h1 className="font-display text-3xl font-semibold leading-tight text-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp
              ? "Start tracking and optimizing your carbon budget today."
              : "Sign in to sync your carbon tracker with the cloud."}
          </p>
        </header>

        <div className="rounded-3xl bg-card border border-border ring-soft p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSignUp && (
              <div>
                <label
                  htmlFor="name-input"
                  className="text-xs font-semibold text-muted-foreground block mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border focus:border-primary focus:outline-none rounded-2xl text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email-input"
                className="text-xs font-semibold text-muted-foreground block mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border focus:border-primary focus:outline-none rounded-2xl text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password-input"
                className="text-xs font-semibold text-muted-foreground block mb-1"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border focus:border-primary focus:outline-none rounded-2xl text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign In"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <span className="relative z-10 px-3 bg-card text-xs text-muted-foreground">or</span>
            <div className="absolute inset-0 top-1/2 border-t border-border -z-0" />
          </div>

          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full inline-flex justify-center items-center gap-2 rounded-full border border-border bg-card py-2.5 text-sm font-medium hover:bg-accent transition"
          >
            Continue as Guest (Offline)
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-primary hover:underline focus:outline-none"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
