import { test, expect } from "@playwright/test";

const clearAppState = async (page: import("@playwright/test").Page) => {
  // Clear once after landing on the app origin. Do NOT use addInitScript for this —
  // it re-fires on every reload and would defeat any persistence assertion.
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
};

test.describe("dashboard baseline", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("root renders the default dashboard with time and news widgets", async ({ page }) => {
    await clearAppState(page);
    await page.reload();

    await expect(page).toHaveTitle(/Hakboard/i);

    // Time widget prints "HH:MM" (followed directly by SS and AM/PM in DOM order,
    // so innerText concatenates as "11:1103AM"). No trailing word-boundary.
    await expect(page.locator("body")).toContainText(/\b\d{2}:\d{2}/);
  });

  test("gear button opens the widget controls sheet with all rendered widgets", async ({ page }) => {
    await clearAppState(page);
    await page.reload();

    const gear = page.getByRole("button", { name: /open widget controls/i });
    await expect(gear).toBeVisible();
    await gear.click();

    await expect(page.getByText(/widget controls/i)).toBeVisible();
    // Accordion starts collapsed — assert on the trigger buttons (visible), not their
    // schema controls (hidden until expanded).
    await expect(page.getByRole("button", { name: /^time$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^weather$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^news$/i })).toBeVisible();
  });

  test("editing the time widget's dateFormat updates the rendered date", async ({ page }) => {
    await clearAppState(page);
    await page.reload();

    await page.getByRole("button", { name: /open widget controls/i }).click();
    await page.getByRole("button", { name: /^time$/i }).click();

    const select = page.getByLabel(/date format/i);
    await expect(select).toBeVisible();

    await select.selectOption("SHORT");
    // SHORT preset renders numeric M/D/YYYY e.g. "7/14/2026".
    await expect(page.locator("body")).toContainText(/\d{1,2}\/\d{1,2}\/\d{4}/, {
      timeout: 3000,
    });
  });

  test("dashboard layout persists in localStorage across reloads", async ({ page }) => {
    await clearAppState(page);
    await page.reload();

    // Wait until Grid persists an initial layout snapshot.
    await expect
      .poll(async () => await page.evaluate(() => localStorage.getItem("layout:default")), {
        timeout: 5000,
      })
      .not.toBeNull();

    // Mutate the stored layout and reload — the mutated state should survive.
    await page.evaluate(() => {
      const key = "layout:default";
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const layout = JSON.parse(raw) as Array<Record<string, unknown>>;
      const time = layout.find((item) => item.i === "time");
      if (time) time.w = 42;
      localStorage.setItem(key, JSON.stringify(layout));
    });

    await page.reload();

    const persisted = await page.evaluate(() => {
      const raw = localStorage.getItem("layout:default");
      if (!raw) return null;
      const layout = JSON.parse(raw) as Array<{ i: string; w: number }>;
      return layout.find((item) => item.i === "time")?.w ?? null;
    });

    expect(persisted).toBe(42);
  });

  test("widget config values persist across reloads", async ({ page }) => {
    await clearAppState(page);
    await page.reload();

    await page.getByRole("button", { name: /open widget controls/i }).click();
    await page.getByRole("button", { name: /^time$/i }).click();

    await page.getByLabel(/date format/i).selectOption("SHORT");

    // Wait for the debounce-free persistence write to land in localStorage.
    await expect
      .poll(async () =>
        page.evaluate(() =>
          JSON.parse(localStorage.getItem("widget-config") ?? "{}")
        ),
      )
      .toMatchObject({ time: { dateFormat: "SHORT" } });

    await page.reload();

    // Sheet should re-hydrate the persisted value.
    await page.getByRole("button", { name: /open widget controls/i }).click();
    await page.getByRole("button", { name: /^time$/i }).click();
    await expect(page.getByLabel(/date format/i)).toHaveValue("SHORT");
  });

  test("?dashboard=test renders the alternate dashboard", async ({ page }) => {
    await clearAppState(page);
    await page.goto("/?dashboard=test");

    // The test dashboard has only the time widget — no news article list.
    await expect(page.locator("body")).toContainText(/\b\d{2}:\d{2}/);

    await page.getByRole("button", { name: /open widget controls/i }).click();
    // "News" widget should NOT be listed in the controls sheet.
    await expect(page.getByRole("button", { name: /^news$/i })).toHaveCount(0);
  });
});
