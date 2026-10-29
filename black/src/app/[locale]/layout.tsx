import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { profile } from "@/lib/profile";
import { INVITATION_BOOTSTRAP } from "@/lib/invitation";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/dancing-script/600.css";
import "../globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const description = [profile.titles[locale], profile.company, profile.bios[locale]].filter(Boolean).join(" · ") || `Digital business card of ${profile.name}`;
  return { title: `${profile.name} | Digital Card`, description, metadataBase: profile.siteUrl ? new URL(profile.siteUrl) : undefined, icons: { icon: "/gold-mark.svg" }, alternates: { languages: { en: "/en", vi: "/vi", ja: "/ja" } } };
}
export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale} suppressHydrationWarning><head><script id="invitation-bootstrap" dangerouslySetInnerHTML={{ __html: INVITATION_BOOTSTRAP }} /><noscript><style>{".invitation-intro{display:none!important}"}</style></noscript></head><body>{children}</body></html>;
}
