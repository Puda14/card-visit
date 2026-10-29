import { test } from "node:test";
import assert from "node:assert/strict";
import { readProfile } from "../src/lib/profile.ts";
import { createVCard } from "../src/lib/vcard.ts";

test("empty contact settings do not create placeholder links", () => {
  const p = readProfile({ EMAIL: " ", PHONE: "", FACEBOOK_URL: "" });
  assert.equal(p.email, "");
  assert.equal(p.phoneHref, "");
  assert.deepEqual(p.socials, []);
});

test("unsafe links and malformed contacts are omitted", () => {
  const p = readProfile({ FACEBOOK_URL: "javascript:alert(1)", TIKTOK_URL: "https://www.tiktok.com/@pickmedev", YOUTUBE_URL: "data:text/html,bad", EMAIL: "invalid", PHONE: "call me", WEBSITE_URL: "ftp://example.com" });
  assert.equal(p.website, "");
  assert.equal(p.email, "");
  assert.equal(p.phoneHref, "");
  assert.deepEqual(p.socials, [{ name: "TikTok", href: "https://www.tiktok.com/@pickmedev", alias: "@pickmedev" }]);
});

test("contact whitespace is normalized and telephone formatting remains readable", () => {
  const p = readProfile({ PERSONAL_NAME: "  Nguyễn An  ", EMAIL: " hello@example.com ", PHONE: "+84 912 345 678" });
  assert.equal(p.name, "Nguyễn An");
  assert.equal(p.email, "hello@example.com");
  assert.equal(p.phone, "+84 912.345.678");
  assert.equal(p.phoneHref, "tel:+84912345678");
});

test("Vietnamese phone display separates country code and groups digits without changing dialing data", () => {
  for (const [input, dial] of [
    ["+84839191315", "tel:+84839191315"],
    ["84839191315", "tel:84839191315"],
    ["0839191315", "tel:0839191315"],
    ["+84 839.191.315", "tel:+84839191315"],
  ]) {
    const p = readProfile({ PHONE: input });
    assert.equal(p.phone, "+84 839.191.315");
    assert.equal(p.phoneHref, dial);
    assert.ok(createVCard(p).includes(`TEL;TYPE=CELL:${dial.slice(4)}\r\n`));
  }
  assert.equal(readProfile({ PHONE: "+81 90 1234 5678" }).phone, "+81 90 1234 5678");
});

test("vCard preserves Vietnamese and escapes delimiter and newline injection", () => {
  const p = readProfile({ PERSONAL_NAME: "Phùng Tiến Đạt", COMPANY_NAME: "Pick, Me; Dev", PERSONAL_BIO: "Hello\nTITLE:Injected", EMAIL: "hello@example.com", PHONE: "+84 912 345 678" });
  const card = createVCard(p);
  assert.ok(card.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
  assert.ok(card.includes("FN:Phùng Tiến Đạt\r\n"));
  assert.ok(card.includes("ORG:Pick\\, Me\\; Dev\r\n"));
  assert.ok(card.includes("NOTE:Hello\\nTITLE:Injected\r\n"));
  assert.ok(card.includes("TEL;TYPE=CELL:+84912345678\r\n"));
  assert.ok(!card.includes("\r\nTITLE:Injected"));
  assert.ok(card.endsWith("END:VCARD\r\n"));
});

test("vCard folds long UTF-8 lines without breaking characters", () => {
  const card = createVCard(readProfile({ PERSONAL_BIO: "Kết nối cùng nhau. ".repeat(30) }));
  for (const line of card.split("\r\n")) assert.ok(Buffer.byteLength(line, "utf8") <= 75);
  assert.ok(card.replace(/\r\n /g, "").includes("NOTE:" + "Kết nối cùng nhau. ".repeat(30).trim()));
});

test("social cards use configured aliases before URL handles", () => {
  const p = readProfile({ TIKTOK_URL: "https://www.tiktok.com/@pick.me.dev", FACEBOOK_URL: "https://www.facebook.com/pickmedevofficial/", YOUTUBE_URL: "https://www.youtube.com/@pickmedev", YOUTUBE_ALIAS: "  Pick Me Dev Official  " });
  assert.deepEqual(p.socials.map(s => [s.name, s.alias]), [
    ["YouTube", "Pick Me Dev Official"], ["TikTok", "@pick.me.dev"], ["Facebook", "pickmedevofficial"],
  ]);
});

test("shared profile URLs show a readable fallback instead of query strings", () => {
  const p = readProfile({ FACEBOOK_URL: "https://facebook.com/profile.php?id=12345", YOUTUBE_URL: "https://youtube.com/channel/UCexample" });
  assert.deepEqual(p.socials.map(s => s.alias), ["UCexample", "facebook.com"]);
});

test("localized role and biography preserve explicit translations and Japanese identity", () => {
  const p = readProfile({ PERSONAL_NAME_JA: "フン・ティエン・ダット", PERSONAL_TITLE: "Chuyên viên", PERSONAL_TITLE_EN: "Executive", PERSONAL_TITLE_JA: "事業開発担当", PERSONAL_BIO: "Xin chào", PERSONAL_BIO_EN: "Hello", PERSONAL_BIO_JA: "こんにちは" });
  assert.equal(p.japaneseName, "フン・ティエン・ダット");
  assert.deepEqual(p.localizedTitle, { vi: "Chuyên viên", en: "Executive", ja: "事業開発担当" });
  assert.deepEqual(p.localizedBio, { vi: "Xin chào", en: "Hello", ja: "こんにちは" });
});
