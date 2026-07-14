import { test, expect, type Page } from "@playwright/test";

// One case per widget in the catalog. Keep this in lockstep with
// src/widgets/catalog.ts — hardcoded here (not imported) so that adding a
// widget requires an intentional test update. Each case declares the
// user-visible control labels the sheet must expose.

interface WidgetCase {
  key: string;
  displayName: string;
  controls: string[];
  // Regex the widget's rendered content must satisfy after isolated mount.
  // Kept broad on purpose — this pins "widget produced *something*" without
  // over-specifying visuals we're about to redesign.
  contentPattern?: RegExp;
  // Some widgets legitimately fetch third-party APIs. Suppress noisy console
  // errors those produce when the env isn't configured (no API key, offline).
  expectedNoiseSubstrings?: string[];
}

const WIDGETS: WidgetCase[] = [
  {
    key: "time",
    displayName: "Time",
    controls: ["Date format"],
    contentPattern: /\d{2}:\d{2}/,
  },
  {
    key: "weather",
    displayName: "Weather",
    controls: ["City", "Metric rotation"],
    // Without VITE_OPEN_WEATHER_API_KEY set the widget still mounts; it just
    // shows the placeholder metric label instead of the hour nodes.
    contentPattern: /temp|°/,
    expectedNoiseSubstrings: ["401", "openweathermap", "Unknown city"],
  },
  {
    key: "news",
    displayName: "News",
    controls: ["Article limit"],
    // News hits an external RSS API; if it's unreachable the ScrollArea just
    // renders empty. Assert the widget host is present rather than content.
    expectedNoiseSubstrings: ["api-panda", "Failed to fetch", "NetworkError"],
  },
  {
    key: "text",
    displayName: "Text",
    controls: ["Content"],
    contentPattern: /Sample text/,
  },
];

const clearAppState = async (page: Page) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
};

const attachErrorGuard = (page: Page, allowedSubstrings: string[] = []) => {
  const errors: string[] = [];
  const isAllowed = (msg: string) =>
    allowedSubstrings.some((s) => msg.toLowerCase().includes(s.toLowerCase()));

  page.on("pageerror", (e) => {
    if (!isAllowed(e.message)) errors.push(`[pageerror] ${e.message}`);
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (!isAllowed(text)) errors.push(`[console.error] ${text}`);
  });
  return errors;
};

test.describe("per-widget isolation baseline", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const w of WIDGETS) {
    test.describe(w.key, () => {
      test(`renders isolated at /?widget=${w.key} without page errors`, async ({ page }) => {
        const errors = attachErrorGuard(page, w.expectedNoiseSubstrings);
        await clearAppState(page);
        await page.goto(`/?widget=${w.key}`);

        // The isolation route wraps the widget in a testid-tagged container.
        await expect(page.getByTestId("widget-isolation-root")).toBeVisible();

        // Give the widget a beat to run any mount effects (data fetch, timers).
        await page.waitForTimeout(500);

        if (w.contentPattern) {
          await expect(page.locator("body")).toContainText(w.contentPattern);
        }

        expect(
          errors,
          `unexpected errors from ${w.key}:\n${errors.join("\n")}`,
        ).toEqual([]);
      });

      test(`sheet lists ${w.displayName} with its schema controls`, async ({ page }) => {
        await clearAppState(page);
        await page.goto(`/?widget=${w.key}`);

        await page.getByRole("button", { name: /open widget controls/i }).click();

        // Widget's own accordion trigger is visible; other widgets are NOT
        // listed (isolation only mounts one).
        const trigger = page.getByRole("button", {
          name: new RegExp(`^${w.displayName}$`, "i"),
        });
        await expect(trigger).toBeVisible();

        // No other widget should be listed in isolation mode.
        for (const other of WIDGETS) {
          if (other.key === w.key) continue;
          await expect(
            page.getByRole("button", { name: new RegExp(`^${other.displayName}$`, "i") }),
          ).toHaveCount(0);
        }

        await trigger.click();
        for (const label of w.controls) {
          await expect(page.getByLabel(new RegExp(label, "i"))).toBeVisible();
        }
      });
    });
  }
});
