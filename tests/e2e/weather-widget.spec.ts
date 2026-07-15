import { test, expect, type Page } from "@playwright/test";

// Design-pin tests for the redesigned WeatherClock. Locks in DOM structure
// (testids on the ring, hourly nodes, center), the metric-rotation contract,
// and behavior that would silently regress if the polar math or hover
// wiring broke again.

const goto = async (page: Page) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/?widget=weather");
  await expect(page.getByTestId("weather-clock")).toBeVisible({ timeout: 10_000 });
};

test.describe("weather clock design", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("renders the clock face and centered current conditions", async ({ page }) => {
    await goto(page);
    // Ring container.
    await expect(page.getByTestId("weather-clock")).toBeVisible();
    // Center block has big value + metric label.
    await expect(page.getByTestId("weather-clock-value")).toContainText(/\d/);
    await expect(page.getByTestId("weather-clock-metric-label")).toContainText(/temp/i);
  });

  test("renders 12 hourly nodes with temperature values", async ({ page }) => {
    await goto(page);
    // Give the query time to hydrate.
    await page.waitForTimeout(1500);

    const nodes = page.getByTestId("weather-clock-node");
    await expect(nodes).toHaveCount(12);

    // Every visible temp cell should end with a degree sign.
    await expect(nodes.first()).toContainText(/\d+°/);
  });

  test("hover on an hourly node opens a portaled detail card", async ({ page }) => {
    await goto(page);
    await page.waitForTimeout(1500);

    const first = page.getByTestId("weather-clock-node").first();
    await first.hover();

    // The hover card renders under body via Radix Portal — assert it isn't
    // a descendant of the weather clock (proves the portal is working).
    const card = page.getByText(/humidity/i).last();
    await expect(card).toBeVisible({ timeout: 2000 });

    const isDescendant = await card.evaluate((el) =>
      Boolean(el.closest("[data-testid=weather-clock]")),
    );
    expect(isDescendant).toBe(false);
  });

  test("metric label rotates when metricRotationInterval elapses", async ({ page }) => {
    await goto(page);
    await page.getByRole("button", { name: /open widget controls/i }).click();
    await page.getByRole("button", { name: /^weather$/i }).click();

    // Set rotation to 5s (the minimum). Default is 30s which would slow
    // this test down needlessly.
    const rot = page.getByLabel(/metric rotation/i);
    await rot.fill("5");

    const label = page.getByTestId("weather-clock-metric-label");
    const initial = (await label.textContent())?.trim();

    // Wait a bit over one rotation. The interval fires 5s after the change
    // takes effect (see useInterval in weather.tsx).
    await expect
      .poll(async () => (await label.textContent())?.trim(), { timeout: 8_000 })
      .not.toBe(initial);
  });
});
