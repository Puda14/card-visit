import { ArrowDownToLine, ArrowUpRight, Globe2, Mail, Phone, Radio } from "lucide-react";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { profile as p } from "@/lib/profile";
import { dictionaries, isLocale, languageNames, locales } from "@/lib/i18n";
import { Intro } from "@/components/intro";
import { Avatar } from "@/components/avatar";
import { ShareButton } from "@/components/share-button";
import { SocialIcon } from "@/components/social-icon";
import { NetworkBackground } from "@/components/network-background";

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export const dynamicParams = false;

function ContactCard({ href, icon, label, value, external = false, social = false }: {
  href: string; icon: ReactNode; label: string; value: string; external?: boolean; social?: boolean;
}) {
  return <a data-enter className={`contact-card${social ? " social-card" : ""}`} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
    <span className="contact-icon">{icon}</span>
    <span className="contact-text"><span className="contact-platform">{label}</span><span className="contact-value">{value}</span></span>
    <ArrowUpRight className="contact-arrow" size={17} aria-hidden="true" />
  </a>;
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionaries[locale];
  const hasContacts = Boolean(p.email || p.phone || p.website || p.socials.length);

  return <>
    <Intro logo={p.logo} company={p.company} slogan={p.slogan} labels={{ skip: t.introSkip, welcome: t.introWelcome, tagline: t.introTagline }} />
    <div id="site-content" className="site-content">
      <NetworkBackground />
      <a className="skip-link" href="#main">{t.skipToContent}</a>
      <header className="header container">
        <a href={`/${locale}`} className="brand" aria-label={p.company}>
          <img src={p.logo} alt="" width={43} height={43} />
          <span>{p.company}<small>{p.slogan}</small></span>
        </a>
        <nav className="language-switch" aria-label={t.language}>
          <Globe2 size={15} aria-hidden="true" />
          {locales.map(language => <a key={language} href={`/${language}`} hrefLang={language} lang={language} aria-label={languageNames[language]} aria-current={locale === language ? "page" : undefined}>{language === "ja" ? "日本語" : language.toUpperCase()}</a>)}
        </nav>
      </header>

      <main id="main" className="container main">
        <article className="profile-panel" aria-labelledby="profile-name">
          <div className="profile-topbar"><span><Radio size={17} aria-hidden="true" />{t.profileLabel}</span><span>{p.company}<i /></span></div>
          <img className="panel-watermark" src={p.logo} alt="" width={240} height={240} aria-hidden="true" />
          <div className="profile-overview">
            <div className="portrait-block" data-enter>
              <div className="portrait-frame"><Avatar src={p.avatar} name={p.name} alt={`${t.portraitAlt} ${p.name}`} /></div>
              <div className="portrait-caption"><img src={p.logo} alt="" width={22} height={22} /><span>{p.company}</span><span className="portrait-accent" /></div>
            </div>
            <div className="profile-identity">
              <p className="eyebrow" data-enter><span />{t.greeting}</p>
              <h1 id="profile-name" lang="vi" data-enter>{p.name}<span className="name-dot">.</span></h1>
              {p.japaneseName && <p className="japanese-name" lang="ja" data-enter>{p.japaneseName}</p>}
              <p className="role" data-enter>{p.localizedTitle[locale]}</p>
              <p className="company-affiliation" data-enter>{p.company}<span aria-hidden="true"> / </span><span>{p.slogan}</span></p>
            </div>
            <p className="profile-bio" data-enter>{p.localizedBio[locale]}</p>
          </div>

          <div id="connect" className="contacts" aria-labelledby="contacts-title">
            <div className="contacts-heading" data-enter><h2 id="contacts-title">{t.contacts}</h2><p>{hasContacts ? t.contactHint : t.emptyContacts}</p></div>
            {hasContacts && <div className="contact-grid">
              {p.phone && <ContactCard href={p.phoneHref} icon={<Phone size={21} aria-hidden="true" />} label={t.phone} value={p.phone} />}
              {p.email && <ContactCard href={`mailto:${p.email}`} icon={<Mail size={22} aria-hidden="true" />} label={t.email} value={p.email} />}
              {p.website && <ContactCard href={p.website} icon={<Globe2 size={22} aria-hidden="true" />} label={t.website} value={new URL(p.website).hostname} external />}
              {p.socials.map(social => <ContactCard key={social.name} href={social.href} icon={<SocialIcon name={social.name} />} label={social.name} value={social.alias} external social />)}
            </div>}
          </div>

          <div className="profile-actions" data-enter>
            <div className="save-contact"><a className="button-primary" href="/contact.vcf" download><ArrowDownToLine size={18} aria-hidden="true" />{t.saveContact}</a><span>{t.vcardHint}</span></div>
            <ShareButton title={`${p.name} | ${p.company}`} labels={{ share: t.share, copied: t.copied, fallback: t.shareFallback }} />
          </div>
        </article>
      </main>

      <footer className="footer container"><span><Radio size={15} aria-hidden="true" />{t.connection}</span><span>© {new Date().getFullYear()} {p.company}</span></footer>
    </div>
  </>;
}
