import { test } from "node:test";
import assert from "node:assert/strict";
import { readProfile } from "../src/lib/profile.ts";
import { createVCard } from "../src/lib/vcard.ts";
test("card uses supplied identity without inventing company or contact data", () => {
  const profile = readProfile({});
  assert.equal(profile.name, "Nguyễn Hữu Nhật");
  assert.equal(profile.company, ""); assert.equal(profile.phone, ""); assert.equal(profile.email, ""); assert.deepEqual(profile.socials, []);
  assert.ok(createVCard(profile).includes("FN:Nguyễn Hữu Nhật"));
});
test("configured contacts validate and Vietnamese telephone display is readable", () => {
  const profile = readProfile({ PHONE: "0839 191 315", EMAIL: "hello@example.com", WEBSITE_URL: "https://example.com", FACEBOOK_URL: "https://facebook.com/nguyenhuunhat", FACEBOOK_ALIAS: "@nguyenhuunhat" });
  assert.equal(profile.phone, "+84 839.191.315"); assert.equal(profile.phoneHref, "tel:+84839191315");
  assert.equal(profile.email, "hello@example.com"); assert.equal(profile.socials[0].alias, "@nguyenhuunhat");
});
test("unsafe or malformed public values never create links", () => {
  const profile = readProfile({ EMAIL: "bad\n@example.com", WEBSITE_URL: "javascript:alert(1)", PHONE: "call-me", AVATAR_PATH: "//evil.test/a.png" });
  assert.equal(profile.email, ""); assert.equal(profile.website, ""); assert.equal(profile.phoneHref, ""); assert.equal(profile.avatar, "");
});
