import { test } from "node:test";
import assert from "node:assert/strict";
import { readProfile } from "../src/lib/profile.ts";
import { createVCard } from "../src/lib/vcard.ts";
test("doctor identity includes professional workplace and omits unspecified direct contacts", () => {
  const p = readProfile({});
  assert.equal(p.name, "Phùng Văn Anh Đức");
  assert.equal(p.phoneHref, ""); assert.equal(p.email, ""); assert.equal(p.company, "Viện Cơ Xương Khớp - Bệnh viện Bạch Mai"); assert.deepEqual(p.socials, []);
  assert.equal(p.professional.degree.vi, "Thạc sĩ, Bác sĩ nội trú (ThS.BSNT)");
  assert.equal(p.relatedLinks.length, 4);
  assert.ok(createVCard(p).includes("Musculoskeletal Medicine"));
});
test("contacts validate URLs, format Vietnamese telephone numbers and respect aliases", () => {
  const p = readProfile({ PHONE: "0839 191 315", EMAIL: "bad\n@email.test", WEBSITE_URL: "javascript:alert(1)", FACEBOOK_URL: "https://facebook.com/doctor", FACEBOOK_ALIAS: "@doctor" });
  assert.equal(p.phone, "+84 839.191.315"); assert.equal(p.phoneHref, "tel:+84839191315");
  assert.equal(p.email, ""); assert.equal(p.website, ""); assert.equal(p.socials[0].alias, "@doctor");
});
test("vCard escapes injected fields and keeps Vietnamese intact", () => {
  const card = createVCard(readProfile({ PERSONAL_NAME: "Đức\nTEL:bad", CLINIC_NAME: "A;B", ADDRESS: "Hà Nội", FACEBOOK_URL: "https://facebook.com/doctor" }));
  assert.ok(card.includes("Đức\\nTEL:bad")); assert.ok(card.includes("ORG:A\\;B"));
  assert.ok(!card.includes("\r\nTEL:bad"));
  assert.ok(card.includes("ADR;TYPE=WORK:;;Hà Nội;;;;"));
  assert.ok(card.includes("X-SOCIALPROFILE;TYPE=Facebook:https://www.facebook.com/doctor") || card.includes("X-SOCIALPROFILE;TYPE=Facebook:https://facebook.com/doctor"));
});
