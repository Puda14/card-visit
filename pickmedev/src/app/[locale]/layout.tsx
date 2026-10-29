import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile } from "@/lib/profile";
import { isLocale } from "@/lib/i18n";
import { APERTURE_BOOTSTRAP } from "@/lib/aperture";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "../globals.css";
import "../experience.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const description = `${profile.localizedTitle[locale]} · ${profile.company}. ${profile.localizedBio[locale]}`;
  return {
    metadataBase: profile.siteUrl ? new URL(profile.siteUrl) : undefined,
    title: `${profile.name} | ${profile.company}`, description,
    icons: { icon: profile.logo, apple: profile.logo },
    alternates: {
      ...(profile.siteUrl ? { canonical: `/${locale}` } : {}),
      languages: { vi: "/vi", en: "/en", ja: "/ja" },
    },
    openGraph: {
      type: "profile", locale: { vi: "vi_VN", en: "en_US", ja: "ja_JP" }[locale],
      title: `${profile.name} | ${profile.company}`, description,
      ...(profile.siteUrl ? { url: `/${locale}`, images: [{ url: profile.avatar, alt: profile.name }] } : {}),
    },
  };
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Translation extensions may attach their own attributes to <html> before React hydrates.
  // Limit the escape hatch to this element; descendants still receive hydration checks.
  return <html lang={locale} suppressHydrationWarning>
    <head>
      <script id="aperture-bootstrap" dangerouslySetInnerHTML={{ __html: APERTURE_BOOTSTRAP }} />
      <noscript><style>{".intro{display:none!important}"}</style></noscript>
    </head>
    <body>{children}</body>
  </html>;
}
