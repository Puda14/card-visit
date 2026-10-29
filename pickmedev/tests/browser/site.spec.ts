import { test, expect } from "@playwright/test";

test("translation-extension attributes on html do not trigger a hydration warning", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", message => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) hydrationErrors.push(message.text());
  });
  page.on("pageerror", error => {
    if (/hydrat/i.test(error.message)) hydrationErrors.push(error.message);
  });
  await page.addInitScript(() => {
    const attach = () => {
      if (!document.documentElement) return false;
      document.documentElement.setAttribute("data-immersive-translate-page-theme", "light");
      return true;
    };
    if (!attach()) {
      const observer = new MutationObserver(() => { if (attach()) observer.disconnect(); });
      observer.observe(document, { childList: true, subtree: true });
    }
  });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.dataset.introState === "revealing");
  await expect(page.locator("html")).toHaveAttribute("data-immersive-translate-page-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Save contact" })).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test("profile stays usable with JavaScript disabled and no empty contact links", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Phùng Tiến Đạt");
  await expect(page.getByRole("link", { name: "Save contact" })).toBeVisible();
  await expect(page.locator('a[href="mailto:"], a[href="tel:"], a[href="undefined"]')).toHaveCount(0);
  await context.close();
});

test("intro can be skipped and is remembered in the same tab", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByTestId("intro")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("intro")).toHaveCount(0);
});

test("reduced motion bypasses intro and remains readable on narrow screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("intro")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("locale links render fully translated pages and Japanese identity without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/vi");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator(".japanese-name")).toHaveText("フン・ティエン・ダット");
  await expect(page.locator("#company, .company-section")).toHaveCount(0);
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Let's connect", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Save contact", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "日本語", exact: true }).click();
  await expect(page).toHaveURL(/\/ja$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("heading", { name: "お問い合わせ", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "連絡先を保存", exact: true })).toBeVisible();
  await expect(page.locator(".profile-bio")).toContainText("一つひとつの出会い");
  const unsupported = await page.goto("/fr");
  expect(unsupported?.status()).toBe(404);
  await context.close();
});

test("portrait stays upright and every language fits phone and tablet screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["vi", "en", "ja"]) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      expect(await page.locator(".portrait-frame").evaluate(el => getComputedStyle(el).transform)).toBe("none");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator(".profile-actions a[download]")).toBeVisible();
    }
  }
});

test("three spiral ribbons curl inward then unwind over the stationary page", async ({ page }) => {
  await page.goto("/vi", { waitUntil: "domcontentloaded" });
  const intro = page.getByTestId("intro");
  await expect(intro).toBeVisible();
  await expect(page.getByTestId("intro-veil")).toHaveCSS("opacity", "1");
  await expect(page.getByTestId("intro-veil")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.getByTestId("intro-emblem")).toHaveCSS("opacity", "1");
  const ring = intro.locator(".intro-logo-ring");
  const ringTransform = await ring.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => ring.evaluate(el => getComputedStyle(el).transform)).not.toBe(ringTransform);
  await page.evaluate(() => document.fonts.ready);
  await expect(intro.locator(".aperture-blade")).toHaveCount(3);
  await expect(intro.locator(".card-band")).toHaveCount(3);
  await expect(intro.locator(".card-band > path")).toHaveCount(6);
  await expect(intro.locator(".ribbon-weave, .ribbon-inner-highlight, [data-testid=aperture-mask-hole]")).toHaveCount(0);
  const coverage = await intro.locator(".camera-aperture").boundingBox();
  expect(coverage?.width).toBe(page.viewportSize()?.width);
  expect(coverage?.height).toBe(page.viewportSize()?.height);
  await expect(intro).toHaveCSS("mask-image", "none");
  await expect(intro).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const initial = await page.locator(".profile-panel").boundingBox();
  const paths = intro.locator(".card-band > path:first-child");
  const initialPaths = await paths.evaluateAll(leaves => leaves.map(leaf => leaf.getAttribute("d")));
  await expect.poll(async () => paths.first().getAttribute("d")).not.toBe(initialPaths[0]);
  const moving = await paths.evaluateAll(leaves => leaves.map(leaf => leaf.getAttribute("d")));
  expect(new Set(moving).size).toBe(3);
  for (let sample = 0; sample < 4; sample++) {
    const rect = await page.locator(".profile-panel").boundingBox();
    expect(rect?.x).toBeCloseTo(initial!.x, 1);
    expect(rect?.y).toBeCloseTo(initial!.y, 1);
    expect(rect?.width).toBeCloseTo(initial!.width, 1);
    expect(rect?.height).toBeCloseTo(initial!.height, 1);
    await expect(page.locator(".profile-panel")).toHaveCSS("transform", "none");
    await expect(page.locator(".profile-panel")).toHaveCSS("opacity", "1");
    await page.waitForTimeout(300);
  }
  const tipRadius = () => paths.first().evaluate(path => {
    const [x, y] = path.getAttribute("d")!.slice(1).split("L")[0].split(" ").map(Number);
    return Math.hypot(x, y);
  });
  await expect.poll(tipRadius).toBeLessThan(85);
  await expect.poll(tipRadius).toBeGreaterThan(1200);
  await expect(page.getByTestId("intro-emblem")).toHaveCSS("opacity", "0");
  expect(await page.getByTestId("intro-veil").evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(0.3);
  await expect(intro).toHaveCSS("opacity", "1");
  await expect(intro).toHaveCount(0, { timeout: 6000 });
  expect(await page.locator("#site-content").evaluate(el => (el as HTMLElement).inert)).toBe(false);
  const final = await page.locator(".profile-panel").boundingBox();
  expect(final?.x).toBeCloseTo(initial!.x, 1);
  expect(final?.width).toBeCloseTo(initial!.width, 1);
  await page.waitForTimeout(200);
  await expect(intro).toHaveCount(0);
});

test("server-rendered intro shows a white cover and centered logo before JavaScript loads", async ({ page }) => {
  await page.route("**/_next/**/*.js*", route => route.abort());
  await page.goto("/en");
  await expect(page.getByTestId("intro")).toBeVisible();
  await expect(page.getByTestId("intro-veil")).toHaveCSS("opacity", "1");
  await expect(page.getByTestId("intro-veil")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  const emblem = await page.getByTestId("intro-emblem").boundingBox();
  expect(emblem!.x + emblem!.width / 2).toBeCloseTo(page.viewportSize()!.width / 2, 0);
  expect(emblem!.y + emblem!.height / 2).toBeCloseTo(page.viewportSize()!.height / 2, 0);
  const painted = await page.evaluate(() => {
    const paths = [...document.querySelectorAll<SVGPathElement>(".aperture-blade > path:first-child")];
    const covered = (x: number, y: number) => paths.some(path => path.isPointInFill(new DOMPoint(x, y).matrixTransform(path.getScreenCTM()!.inverse())));
    const edgePoints = [[innerWidth / 2, 10], [10, innerHeight / 2], [innerWidth - 10, innerHeight / 2], [innerWidth / 2, innerHeight - 10]];
    return { count: paths.length, center: covered(innerWidth / 2, innerHeight / 2), paintedEdges: edgePoints.filter(([x, y]) => covered(x, y)).length };
  });
  expect(painted.count).toBe(3);
  expect(painted.center).toBe(false);
  expect(painted.paintedEdges).toBeGreaterThanOrEqual(2);
});

test("intro traps keyboard focus until Escape restores access to the profile", async ({ page }) => {
  await page.goto("/vi", { waitUntil: "domcontentloaded" });
  const skip = page.getByRole("button", { name: "Bỏ qua mở đầu" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("intro")).toHaveCount(0);
  expect(await page.locator("#site-content").evaluate(el => (el as HTMLElement).inert)).toBe(false);
});

test("vCard download contains actual identity and correct response headers", async ({ request }) => {
  const response = await request.get("/contact.vcf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/vcard");
  expect(response.headers()["content-disposition"]).toContain("attachment");
  expect(await response.text()).toContain("FN:Phùng Tiến Đạt");
});

test("connection strands animate and pause when reduced motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const canvas = page.locator(".network-background canvas");
  await expect(page.locator(".network-background")).toHaveClass(/is-ready/);
  const still = await canvas.evaluate(el => (el as HTMLCanvasElement).toDataURL());
  await page.waitForTimeout(180);
  expect(await canvas.evaluate(el => (el as HTMLCanvasElement).toDataURL())).toBe(still);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(async () => canvas.evaluate(el => (el as HTMLCanvasElement).toDataURL())).not.toBe(still);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(100);
  const paused = await canvas.evaluate(el => (el as HTMLCanvasElement).toDataURL());
  await page.waitForTimeout(180);
  expect(await canvas.evaluate(el => (el as HTMLCanvasElement).toDataURL())).toBe(paused);
  await expect(page.locator(".profile-panel")).toBeVisible();
});

test("skipping the aperture keeps the existing page at its original scale", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.locator(".profile-panel")).toHaveCSS("opacity", "1");
  await expect(page.locator(".profile-panel")).toHaveCSS("transform", "none");
  await expect(page.locator(".profile-actions")).toHaveCSS("opacity", "1");
  for (const card of await page.locator(".contact-card").all()) {
    await expect(card).toHaveCSS("opacity", "1");
    await expect(card).toBeVisible();
  }
  await expect(page.locator(".portrait-frame")).toHaveCSS("transform", "none");
});

test("missing avatar displays initials and blocked storage does not trap the intro", async ({ page }) => {
  await page.route("**/avatar/avatar.png", route => route.abort());
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Storage disabled"); } });
  });
  await page.goto("/");
  await expect(page.getByTestId("avatar-fallback")).toBeVisible();
  await expect(page.getByTestId("intro")).toHaveCount(0, { timeout: 7000 });
  await expect(page.getByRole("link", { name: "Save contact" })).toBeVisible();
});
