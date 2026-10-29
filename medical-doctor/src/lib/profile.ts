import type { Locale } from "./i18n";
export type SocialName = "Facebook" | "YouTube" | "TikTok";
export function webUrl(value?: string) {
  try { const u = new URL(value?.trim() || ""); return ["http:", "https:"].includes(u.protocol) && !u.username && !u.password ? u.href : ""; } catch { return ""; }
}
export function readProfile(env: Record<string, string | undefined>) {
  const text = (key: string, fallback = "") => env[key]?.trim() || fallback;
  const localized = (key: string, defaults: Record<Locale, string>) => Object.fromEntries(
    (["en", "vi", "ja"] as const).map(locale => [locale, text(`${key}_${locale.toUpperCase()}`, defaults[locale])]),
  ) as Record<Locale, string>;
  const titles = localized("TITLE", { en: "Medical Doctor", vi: "Bác sĩ", ja: "医師" });
  const specialties = localized("SPECIALTY", { en: "Musculoskeletal Medicine", vi: "Y học Cơ xương khớp", ja: "運動器医学" });
  const slogans = localized("SLOGAN", { en: "Healing begins with the smallest acts of care.", vi: "Chữa lành bắt đầu từ những quan tâm nhỏ nhất.", ja: "癒しは、小さな思いやりから。" });
  const professional = {
    degree: { en: "Master of Medicine, Resident Physician (M.Med., Resident)", vi: "Thạc sĩ, Bác sĩ nội trú (ThS.BSNT)", ja: "医学修士・専攻医" },
    training: { en: "Resident physician trained at Hanoi Medical University", vi: "Bác sĩ nội trú Y Hà Nội", ja: "ハノイ医科大学 専攻医課程" },
    expertise: { en: "Musculoskeletal Medicine", vi: "Chuyên ngành Cơ xương khớp", ja: "運動器医学・リウマチ科" },
    workplace: { en: "Institute of Musculoskeletal Medicine - Bach Mai Hospital", vi: "Viện Cơ Xương Khớp - Bệnh viện Bạch Mai", ja: "バックマイ病院 運動器医学研究所" },
  } satisfies Record<string, Record<Locale, string>>;
  const digits = text("PHONE").replace(/[\s().-]/g, "");
  const validPhone = /^\+?\d{6,15}$/.test(digits);
  const national = digits.match(/^(?:\+?84|0)(\d{9})$/)?.[1];
  const email = text("EMAIL");
  const avatar = text("AVATAR_PATH");
  const socials = (["Facebook", "YouTube", "TikTok"] as const).flatMap(name => {
    const href = webUrl(env[`${name.toUpperCase()}_URL`]);
    if (!href) return [];
    const u = new URL(href);
    return [{ name, href, alias: text(`${name.toUpperCase()}_ALIAS`, u.pathname.split("/").filter(Boolean)[0] || u.hostname) }];
  });
  const relatedLinks = [
    { key: "rheumatology", href: webUrl(text("RELATED_RHEUMATOLOGY_URL", "https://rheumatology.org.vn/author/phungvananhduc/")) },
    { key: "mskCenter", href: webUrl(text("RELATED_MSK_CENTER_URL", "https://trungtamcoxuongkhop.com/author/phungvananhduc/")) },
    { key: "ifr", href: webUrl(text("RELATED_IFR_URL", "https://ifr.org.vn/author/phungvananhduc/")) },
    { key: "schedule", href: webUrl(text("RELATED_SCHEDULE_URL", "https://hih.vn/lich-kham/")) },
  ].filter((item): item is { key: string; href: string } => Boolean(item.href));
  return {
    name: text("PERSONAL_NAME", "Phùng Văn Anh Đức"), japaneseName: text("PERSONAL_NAME_JA"), titles, specialties, slogans,
    title: `${titles.en} · ${specialties.en}`, bio: slogans.en,
    company: text("CLINIC_NAME", professional.workplace.vi), address: text("ADDRESS"),
    professional, workplaceUrl: webUrl(text("WORKPLACE_URL", "https://bachmai.gov.vn/don-vi/vien-co-xuong-khop-bach-mai/a5dadce5-d69f-c819-4042-620a8f5919ab")), relatedLinks,
    phone: validPhone ? national ? `+84 ${national.match(/\d{3}/g)!.join(".")}` : text("PHONE") : "",
    phoneHref: validPhone ? `tel:${national ? `+84${national}` : digits}` : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[?&#]/.test(email) ? email : "",
    website: webUrl(env.WEBSITE_URL), map: webUrl(env.MAP_URL), siteUrl: webUrl(env.SITE_URL), socials,
    avatar: avatar.startsWith("/") && !avatar.startsWith("//") && !/[\\\r\n]/.test(avatar) ? avatar : "",
  };
}
export type Profile = ReturnType<typeof readProfile>;
export const profile = readProfile(process.env);
