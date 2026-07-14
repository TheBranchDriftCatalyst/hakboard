import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Serialize on this machine — browser process management is flaky under load.
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      // Firefox works reliably on this dev machine — keep it first as the
      // known-good baseline for local runs.
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    // Chromium is only enabled in CI because this developer machine still
    // segfaults chrome-headless-shell (SEGV_ACCERR at launch) even after
    // recent permission tweaks. Linux CI runners launch it fine.
    ...(process.env.CI
      ? [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
      : []),
  ],

  webServer: {
    command: `yarn dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
