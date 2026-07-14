import { test, expect, type Page } from "@playwright/test";

// Design-pin tests for the redesigned TimeWidget. These lock in the schema
// (four controls: hour24, showSeconds, showDate, dateFormat), the DOM
// structure (testid-tagged parts), and the observable behavior of each
// control. Renders in isolation so no other widgets are in scope.

const goto = async (page: Page) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/?widget=time");
  await expect(page.getByTestId("time-widget")).toBeVisible();
};

const openControls = async (page: Page) => {
  await page.getByRole("button", { name: /open widget controls/i }).click();
  await page.getByRole("button", { name: /^time$/i }).click();
};

test.describe("time widget design", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("default state: HH:MM + seconds + AM/PM + full date, all visible", async ({ page }) => {
    await goto(page);

    // Main clock: HH:MM with a colon between.
    await expect(page.getByTestId("time-clock")).toContainText(/\d{2}:\d{2}/);
    // Seconds slot present (default showSeconds=true).
    await expect(page.getByTestId("time-seconds")).toContainText(/^\d{2}$/);
    // AM/PM present (default hour24=false).
    await expect(page.getByTestId("time-ampm")).toContainText(/^(AM|PM)$/);
    // Date present (default showDate=true) with FULL preset — month name + year.
    await expect(page.getByTestId("time-date")).toContainText(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b.+\d{4}/,
    );
  });

  test("24-hour toggle removes AM/PM and switches clock format", async ({ page }) => {
    await goto(page);
    await openControls(page);
    await page.getByLabel(/24-hour/i).check();

    await expect(page.getByTestId("time-ampm")).toHaveCount(0);
    // Clock hour should fall in 00-23 (not 01-12). Sample a beat.
    const hh = (await page.getByTestId("time-clock").innerText()).slice(0, 2);
    expect(Number(hh)).toBeGreaterThanOrEqual(0);
    expect(Number(hh)).toBeLessThanOrEqual(23);
  });

  test("show-seconds toggle hides the seconds slot", async ({ page }) => {
    await goto(page);
    await openControls(page);
    await page.getByLabel(/show seconds/i).uncheck();

    await expect(page.getByTestId("time-seconds")).toHaveCount(0);
    // AM/PM should still be there — untouched by this toggle.
    await expect(page.getByTestId("time-ampm")).toBeVisible();
  });

  test("show-date toggle hides the date row", async ({ page }) => {
    await goto(page);
    await openControls(page);
    await page.getByLabel(/show date/i).uncheck();

    await expect(page.getByTestId("time-date")).toHaveCount(0);
    // Clock still visible.
    await expect(page.getByTestId("time-clock")).toBeVisible();
  });

  test("dateFormat SHORT renders numeric M/D/YYYY", async ({ page }) => {
    await goto(page);
    await openControls(page);
    await page.getByLabel(/date format/i).selectOption("SHORT");

    await expect(page.getByTestId("time-date")).toContainText(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
  });

  test("dateFormat HUGE renders the weekday", async ({ page }) => {
    await goto(page);
    await openControls(page);
    await page.getByLabel(/date format/i).selectOption("HUGE");

    await expect(page.getByTestId("time-date")).toContainText(
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),/,
    );
  });

  test("clock font scales up with a wider container (fluid sizing)", async ({ page }) => {
    // Small viewport first
    await page.setViewportSize({ width: 480, height: 600 });
    await goto(page);
    const smallSize = await page
      .getByTestId("time-clock")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

    // Large viewport — force resize by reloading (the ResizeObserver in
    // WidgetHost will pick up the new dimensions on mount).
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.reload();
    await expect(page.getByTestId("time-widget")).toBeVisible();
    const largeSize = await page
      .getByTestId("time-clock")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

    expect(largeSize).toBeGreaterThan(smallSize * 1.5);
  });
});
