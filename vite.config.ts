// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Builds a standalone Node server to dist/server/index.mjs (started with
  // `node dist/server/index.mjs`, honours PORT). The preset also serves the
  // client assets, so one process handles everything — required by Passenger-
  // style hosts that boot a single startup file. Same setup as the Executive
  // Edge app; see its vite.config.ts for the full rationale (dist vs .output).
  nitro: { preset: "node-server", output: { dir: "dist" } },
});
