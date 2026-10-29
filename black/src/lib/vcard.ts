import type { Profile } from "./profile";

function escapeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function foldLine(line: string): string {
  let result = "";
  let bytes = 0;
  for (const character of line) {
    const size = Buffer.byteLength(character, "utf8");
    if (bytes + size > 75) {
      result += "\r\n ";
      bytes = 1;
    }
    result += character;
    bytes += size;
  }
  return result;
}

export function createVCard(p: Profile): string {
  const lines = [
    "BEGIN:VCARD", "VERSION:3.0", `FN:${escapeValue(p.name)}`,
    `N:;${escapeValue(p.name)};;;`, `ORG:${escapeValue(p.company)}`,
    `TITLE:${escapeValue(p.title)}`, `NOTE:${escapeValue(p.bio)}`,
  ];
  if (p.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeValue(p.email)}`);
  if (p.phoneHref) lines.push(`TEL;TYPE=CELL:${p.phoneHref.slice(4)}`);
  if (p.website) lines.push(`URL:${escapeValue(p.website)}`);
  if (p.address) lines.push(`ADR;TYPE=WORK:;;${escapeValue(p.address)};;;;`);
  for (const social of p.socials) lines.push(`X-SOCIALPROFILE;TYPE=${social.name}:${escapeValue(social.href)}`);
  lines.push("END:VCARD");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
