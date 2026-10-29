import type { Locale } from "./i18n";
export type SocialName = "Facebook" | "YouTube" | "TikTok";
export function webUrl(value?: string) {
  try { const url = new URL(value?.trim() || ""); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : ""; } catch { return ""; }
}
export function readProfile(env: Record<string, string | undefined>) {
  const text = (key: string, fallback = "") => env[key]?.trim() || fallback;
  const localized = (key: string) => Object.fromEntries((["en", "vi", "ja"] as const).map(locale => [locale, text(`${key}_${locale.toUpperCase()}`)])) as Record<Locale, string>;
  const digits = text("PHONE").replace(/[\s().-]/g, "");
  const validPhone = /^\+?\d{6,15}$/.test(digits);
  const national = digits.match(/^(?:\+?84|0)(\d{9})$/)?.[1];
  const email = text("EMAIL");
  const avatar = text("AVATAR_PATH");
  const socials = (["Facebook", "YouTube", "TikTok"] as const).flatMap(name => {
    const href = webUrl(env[`${name.toUpperCase()}_URL`]);
    if (!href) return [];
    const url = new URL(href);
    return [{ name, href, alias: text(`${name.toUpperCase()}_ALIAS`, url.pathname.split("/").filter(Boolean).at(-1) || url.hostname) }];
  });
  return {
    name: text("PERSONAL_NAME", "Nguyễn Hữu Nhật"), japaneseName: text("PERSONAL_NAME_JA"), titles: localized("PERSONAL_TITLE"), bios: localized("PERSONAL_BIO"),
    title: text("PERSONAL_TITLE_EN"), bio: text("PERSONAL_BIO_EN"), company: text("COMPANY_NAME"), slogan: text("COMPANY_SLOGAN"), address: text("ADDRESS"),
    phone: validPhone ? national ? `+84 ${national.match(/\d{3}/g)!.join(".")}` : text("PHONE") : "", phoneHref: validPhone ? `tel:${national ? `+84${national}` : digits}` : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[?&#]/.test(email) ? email : "",
    website: webUrl(env.WEBSITE_URL), siteUrl: webUrl(env.SITE_URL), socials,
    avatar: avatar.startsWith("/") && !avatar.startsWith("//") && !/[\\\r\n]/.test(avatar) ? avatar : "",
  };
}
export type Profile = ReturnType<typeof readProfile>;
export const profile = readProfile(process.env);
