import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Vitest configuration for deep-portfolio.
 *
 * Test tooling choice: Vitest + React Testing Library, per TS-001
 * (`.sdlc/test-strategies/TS-001-epic-01-portfolio-repositioning.md`) §2,
 * which names "Vitest/Jest + React Testing Library" as the contracted
 * unit-layer tooling and leaves the specific pick to Developer. Vitest is
 * chosen over Jest for native ESM/Vite alignment with Next.js's toolchain
 * and faster local iteration.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
