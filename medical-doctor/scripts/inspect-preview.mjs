import { chromium } from "@playwright/test";
import { mkdir, copyFile } from "node:fs/promises";
await mkdir("qa/video", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, recordVideo: { dir: "qa/video", size: { width: 1440, height: 1100 } } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await page.goto("http://127.0.0.1:3002/en");
await page.screenshot({ path: "qa/curtain-initial.png" });
await page.waitForTimeout(1000);
await page.screenshot({ path: "qa/curtain-opening.png" });
await page.getByTestId("curtain-intro").waitFor({ state: "detached" });
await page.screenshot({ path: "qa/desktop.png", fullPage: true });
await context.close();
await copyFile(await page.video().path(), "qa/curtain-preview.webm");
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const phone = await mobile.newPage();
for (const locale of ["en", "vi", "ja"]) {
  await phone.goto(`http://127.0.0.1:3002/${locale}`);
  await phone.screenshot({ path: `qa/mobile-${locale}.png`, fullPage: true });
}
await browser.close();
console.log(JSON.stringify({ errors, screenshots: "qa/", video: "qa/curtain-preview.webm" }));
