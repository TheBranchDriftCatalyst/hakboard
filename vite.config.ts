import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Radix subpackages each bring their own react copy under a workspace
    // install. Force a single dispatcher or hooks throw "invalid hook call".
    dedupe: ["react", "react-dom"],
  },
  // prop-types (used transitively by react-draggable + react-resizable which
  // power react-grid-layout's drag/resize) references bare `process.env.NODE_ENV`
  // in dev builds. Without this, unguarded `process` lookups throw at runtime
  // and silently kill event wiring on the resize handles — grid drag still
  // works, resize just... doesn't.
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
}));
