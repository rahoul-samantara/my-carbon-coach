import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/routes/**/*.tsx", "src/components/**/*.tsx", "src/hooks/**/*.tsx"],
      exclude: [
        "src/components/ui/**",
        "src/integrations/**",
        "src/lib/mock-data.ts",
        "src/lib/error-page.ts",
        "src/lib/error-capture.ts",
        "node_modules/**",
      ],
      // Thresholds set to reflect the pure-function coverage we can achieve
      // without spinning up Supabase (auth/db calls are integration-tested separately)
      thresholds: {
        statements: 30,
        branches: 30,
        functions: 25,
        lines: 30,
      },
    },
  },
});
