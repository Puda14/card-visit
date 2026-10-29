import { test, expect } from "@playwright/test";
test("curtains mask first frame, move in opposite directions and reveal a stationary profile", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  const intro = page.getByTestId("curtain-intro");
  await expect(intro).toBeVisible();
  await expect(intro.locator(".curtain-panel")).toHaveCount(2);
  await expect(intro.locator(".curtain-left")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  const initial = await page.locator(".profile-panel").boundingBox();
  await page.waitForTimeout(1300);
  const left = await intro.locator(".curtain-left").boundingBox();
  const right = await intro.locator(".curtain-right").boundingBox();
  expect(left!.x).toBeLessThan(-10);
  expect(right!.x).toBeGreaterThan(page.viewportSize()!.width / 2 + 10);
  await expect(intro).toHaveCount(0);
  const final = await page.locator(".profile-panel").boundingBox();
  expect(final!.x).toBeCloseTo(initial!.x, 1); expect(final!.width).toBeCloseTo(initial!.width, 1);
  await expect(page.locator(".profile-panel")).toHaveCSS("transform", "none");
  await page.reload(); await expect(intro).toHaveCount(0);
});
test("Escape releases focus and reduced motion skips curtains", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("button", { name: "Skip intro" })).toBeFocused();
  await page.keyboard.press("Tab"); await expect(page.getByRole("button", { name: "Skip intro" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("curtain-intro")).toHaveCount(0);
  expect(await page.locator("#site-content").evaluate(el => (el as HTMLElement).inert)).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/vi");
  await expect(page.getByTestId("curtain-intro")).toHaveCount(0);
});
test("every locale fits phone, tablet and desktop without blank links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["en", "vi", "ja"]) for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Phùng Văn Anh Đức");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('a[href="mailto:"], a[href="tel:"], a[href="undefined"]')).toHaveCount(0);
  }
});
test("Vietnamese profile presents credentials, workplace and four related resources", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vi");
  const professional = page.locator(".professional-profile");
  await expect(professional).toContainText("Thạc sĩ, Bác sĩ nội trú (ThS.BSNT)");
  await expect(professional).toContainText("Bác sĩ nội trú Y Hà Nội");
  await expect(professional).toContainText("Chuyên ngành Cơ xương khớp");
  await expect(professional.getByRole("link", { name: /Viện Cơ Xương Khớp/ })).toHaveAttribute("href", /bachmai\.gov\.vn/);
  const resources = page.locator(".related-card");
  await expect(resources).toHaveCount(4);
  await expect(resources.nth(0)).toHaveAttribute("href", "https://rheumatology.org.vn/author/phungvananhduc/");
  await expect(resources.nth(3)).toHaveAttribute("href", "https://hih.vn/lich-kham/");
});
test("no JavaScript retains profile and vCard downloads correctly", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto("/en");
  await expect(page.getByTestId("curtain-intro")).toBeHidden();
  await expect(page.getByRole("link", { name: "Save contact" })).toBeVisible();
  await page.getByRole("link", { name: "Tiếng Việt", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await context.close();
  const result = await request.get("/contact.vcf");
  expect(result.headers()["content-type"]).toContain("text/vcard");
  expect(await result.text()).toContain("FN:Phùng Văn Anh Đức");
});
