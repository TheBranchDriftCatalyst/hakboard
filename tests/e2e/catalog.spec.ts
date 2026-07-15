import { test, expect, type Page } from "@playwright/test";

// Mirrors the widget-catalog module. Keep in sync when adding a widget.
const WIDGETS = ["time", "weather", "news", "text"] as const;
const DISPLAY_NAMES = ["Time", "Weather", "News", "Text"];

const clearAppState = async (page: Page) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
};

test.describe("catalog page", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("/catalog renders every widget in a grid cell", async ({ page }) => {
    await clearAppState(page);
    await page.goto("/catalog");

    await expect(page.getByTestId("catalog-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: /widget catalog/i })).toBeVisible();

    for (const key of WIDGETS) {
      await expect(page.getByTestId(`catalog-cell-${key}`)).toBeVisible();
    }
  });

  test("catalog sheet lists every widget with its display name", async ({ page }) => {
    await clearAppState(page);
    await page.goto("/catalog");

    await page.getByRole("button", { name: /open widget controls/i }).click();

    for (const name of DISPLAY_NAMES) {
      await expect(
        page.getByRole("button", { name: new RegExp(`^${name}$`, "i") }),
      ).toBeVisible();
    }
  });

  test("catalog renders without page errors", async ({ page }) => {
    const errors: string[] = [];
    // Weather 401s + news fetch errors are expected without external config.
    const noise = ["401", "openweathermap", "api-panda", "NetworkError", "Failed to fetch"];
    page.on("pageerror", (e) => {
      if (!noise.some((n) => e.message.toLowerCase().includes(n.toLowerCase()))) {
        errors.push(`[pageerror] ${e.message}`);
      }
    });
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const text = m.text();
      if (!noise.some((n) => text.toLowerCase().includes(n.toLowerCase()))) {
        errors.push(`[console.error] ${text}`);
      }
    });

    await clearAppState(page);
    await page.goto("/catalog");
    await page.waitForTimeout(1500);

    expect(errors, `unexpected errors: ${errors.join("\n")}`).toEqual([]);
  });
});
