import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { profile } from "@/lib/profile";
import { CURTAIN_BOOTSTRAP } from "@/lib/curtain";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "../globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: `${profile.name} | ${profile.titles[locale]}`,
    description: `${profile.specialties[locale]}. ${profile.slogans[locale]}`,
    metadataBase: profile.siteUrl ? new URL(profile.siteUrl) : undefined,
    icons: { icon: "/medical-cross.svg" },
    alternates: { languages: { en: "/en", vi: "/vi", ja: "/ja" } },
  };
}
export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale} suppressHydrationWarning>
    <head><script id="curtain-bootstrap" dangerouslySetInnerHTML={{ __html: CURTAIN_BOOTSTRAP }} /><noscript><style>{".curtain-intro{display:none!important}"}</style></noscript></head>
    <body>{children}</body>
  </html>;
}
