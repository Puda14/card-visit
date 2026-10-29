import { test, expect } from "@playwright/test";
test("black and gold invitation opens in opposite directions over a stationary card", async ({ page }) => {
  await page.goto("/"); await expect(page).toHaveURL(/\/en$/);
  const intro = page.getByTestId("invitation-intro"); await expect(intro).toBeVisible();
  await expect(intro).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(intro.locator(".invitation-black")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(intro.locator(".invitation-gold")).toBeVisible();
  const initial = await page.locator(".profile-card").boundingBox();
  await page.waitForTimeout(1400);
  const left = await intro.locator(".invitation-black").boundingBox(); const right = await intro.locator(".invitation-gold").boundingBox();
  expect(left!.x).toBeLessThan(-10); expect(right!.x).toBeGreaterThan(page.viewportSize()!.width / 2 + 10);
  await expect(intro).toHaveCount(0);
  const final = await page.locator(".profile-card").boundingBox(); expect(final!.x).toBeCloseTo(initial!.x, 1); expect(final!.width).toBeCloseTo(initial!.width, 1);
  await expect(page.locator(".profile-card")).toHaveCSS("transform", "none");
});
test("handwritten name font and three locales fit phone through desktop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["en", "vi", "ja"]) for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nguyễn Hữu Nhật");
    expect(await page.getByRole("heading", { level: 1 }).evaluate(el => getComputedStyle(el).fontFamily)).toContain("Dancing Script");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test("intro supports keyboard, session memory and reduced motion", async ({ page }) => {
  await page.goto("/vi"); const skip = page.getByRole("button", { name: "Bỏ qua mở đầu" }); await expect(skip).toBeFocused();
  await page.keyboard.press("Tab"); await expect(skip).toBeFocused(); await page.keyboard.press("Escape");
  await expect(page.getByTestId("invitation-intro")).toHaveCount(0); await page.reload(); await expect(page.getByTestId("invitation-intro")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/en"); await expect(page.getByTestId("invitation-intro")).toHaveCount(0);
});
test("no JavaScript keeps profile and vCard available without empty links", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage(); await page.goto("/en");
  await expect(page.getByTestId("invitation-intro")).toBeHidden(); await expect(page.getByRole("link", { name: "Save contact" })).toBeVisible();
  await expect(page.locator('a[href="mailto:"],a[href="tel:"],a[href="undefined"]')).toHaveCount(0); await context.close();
  const response = await request.get("/contact.vcf"); expect(response.headers()["content-type"]).toContain("text/vcard"); expect(await response.text()).toContain("FN:Nguyễn Hữu Nhật");
});
