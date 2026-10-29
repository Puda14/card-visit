import type { Locale } from "./i18n";

export type SocialName = "YouTube" | "TikTok" | "Facebook";
export type Profile = {
  name: string;
  japaneseName: string;
  title: string;
  bio: string;
  localizedTitle: Record<Locale, string>;
  localizedBio: Record<Locale, string>;
  company: string;
  slogan: string;
  email: string;
  phone: string;
  phoneHref: string;
  website: string;
  siteUrl: string;
  avatar: string;
  logo: string;
  socials: { name: SocialName; href: string; alias: string }[];
};

export function webUrl(value: string | undefined): string {
  if (!value?.trim()) return "";
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch {
    return "";
  }
}

function assetPath(value: string | undefined, fallback: string): string {
  const path = value?.trim();
  return path?.startsWith("/") && !path.startsWith("//") && !/[\\\r\n]/.test(path) ? path : fallback;
}

function socialAlias(href: string): string {
  const url = new URL(href);
  let path = url.pathname;
  try { path = decodeURIComponent(path); } catch { /* Keep the original URL text. */ }
  const parts = path.split("/").filter(Boolean);
  const first = parts[0];
  if (["channel", "c", "user", "pages"].includes(first) && parts[1]) return parts[1];
  if (first && !["profile.php", "share", "watch", "reels", "reel"].includes(first)) return first;
  return url.hostname.replace(/^www\./, "");
}

function displayPhone(normalized: string, original: string): string {
  const national = normalized.match(/^(?:\+?84|0)(\d{9})$/)?.[1];
  return national ? `+84 ${national.match(/\d{3}/g)!.join(".")}` : original;
}

export function readProfile(env: Record<string, string | undefined>): Profile {
  const text = (key: string, fallback = "") => env[key]?.trim() || fallback;
  const email = text("EMAIL");
  const phone = text("PHONE");
  const digits = phone.replace(/[\s().-]/g, "");
  const validPhone = /^\+?\d{6,15}$/.test(digits);
  const socials: Profile["socials"] = [];
  for (const [name, key] of [["YouTube", "YOUTUBE_URL"], ["TikTok", "TIKTOK_URL"], ["Facebook", "FACEBOOK_URL"]] as const) {
    const href = webUrl(env[key]);
    if (href) socials.push({ name, href, alias: text(key.replace("_URL", "_ALIAS"), socialAlias(href)) });
  }
  return {
    name: text("PERSONAL_NAME", "Phùng Tiến Đạt"),
    japaneseName: text("PERSONAL_NAME_JA", text("PERSONAL_NAME", "Phùng Tiến Đạt") === "Phùng Tiến Đạt" ? "フン・ティエン・ダット" : ""),
    title: text("PERSONAL_TITLE", "Business Development Executive"),
    bio: text("PERSONAL_BIO", "Mỗi kết nối là khởi đầu của một cơ hội mới. Rất vui được gặp bạn và cùng mở ra những điều tốt đẹp phía trước."),
    company: text("COMPANY_NAME", "Pick Me Dev"),
    slogan: text("COMPANY_SLOGAN", "We reach the top together"),
    localizedTitle: {
      vi: text("PERSONAL_TITLE_VI", text("PERSONAL_TITLE", "Chuyên viên Phát triển Kinh doanh")),
      en: text("PERSONAL_TITLE_EN", text("PERSONAL_TITLE", "Business Development Executive")),
      ja: text("PERSONAL_TITLE_JA", text("PERSONAL_TITLE", "事業開発担当")),
    },
    localizedBio: {
      vi: text("PERSONAL_BIO_VI", text("PERSONAL_BIO", "Mỗi kết nối là khởi đầu của một cơ hội mới. Rất vui được gặp bạn.")),
      en: text("PERSONAL_BIO_EN", "Every connection is the beginning of a new opportunity. It's a pleasure to meet you and explore what we can achieve together."),
      ja: text("PERSONAL_BIO_JA", "一つひとつの出会いが、新しい可能性の始まりです。皆さまとつながり、ともに歩んでいけることを楽しみにしています。"),
    },
    email: /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) && !/[?&#]/.test(email) ? email : "",
    phone: validPhone ? displayPhone(digits, phone) : "",
    phoneHref: validPhone ? `tel:${digits}` : "",
    website: webUrl(env.WEBSITE_URL),
    siteUrl: webUrl(env.SITE_URL),
    avatar: assetPath(env.AVATAR_PATH, "/avatar/avatar.png"),
    logo: assetPath(env.LOGO_PATH, "/card_visit_image/logo.png"),
    socials,
  };
}

export const profile = readProfile(process.env);
