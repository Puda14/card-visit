import { ArrowDownToLine, ArrowUpRight, Globe2, Mail, Phone, Radio } from "lucide-react";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { dictionaries, isLocale, languageNames, locales } from "@/lib/i18n";
import { profile as p } from "@/lib/profile";
import { InvitationIntro } from "@/components/invitation-intro";
import { Avatar } from "@/components/avatar";
import { ShareButton } from "@/components/share-button";
import { SocialIcon } from "@/components/social-icon";

export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export const dynamicParams = false;
function ContactCard({ href, icon, label, value, external = false }: { href: string; icon: ReactNode; label: string; value: string; external?: boolean }) {
  return <a className="contact-card" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span className="contact-icon">{icon}</span><span className="contact-copy"><small>{label}</small><strong>{value}</strong></span><ArrowUpRight className="contact-arrow" size={16} aria-hidden="true" /></a>;
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionaries[locale];
  const contacts = Boolean(p.phone || p.email || p.website || p.socials.length);
  const initials = p.name.split(/\s+/).filter(Boolean).map(word => word[0]).slice(-3).join("");
  return <>
    <InvitationIntro name={p.name} skip={t.skip} welcome={t.welcome} />
    <div id="site-content">
      <div className="gold-ambient" aria-hidden="true"><span /><span /><span /></div>
      <a className="skip-link" href="#main">{t.skipContent}</a>
      <header className="header container"><a href={`/${locale}`} className="brand"><span>{initials}</span><i>{p.name}</i></a><nav className="language-switch" aria-label={t.language}><Globe2 size={15} />{locales.map(language => <a key={language} href={`/${language}`} hrefLang={language} lang={language} aria-label={languageNames[language]} aria-current={locale === language ? "page" : undefined}>{language === "ja" ? "日本語" : language.toUpperCase()}</a>)}</nav></header>
      <main id="main" className="container">
        <article className="profile-card" aria-labelledby="profile-name">
          <div className="card-label"><span>{t.profile}</span><i /></div>
          <section className="identity">
            <div className={`portrait${p.avatar ? " has-image" : ""}`}>{p.avatar ? <Avatar src={p.avatar} name={p.name} /> : <><span>{initials}</span><small>PRIVATE EDITION</small></>}</div>
            <div className="identity-copy">
              <p className="overline">{p.company || "PERSONAL CONNECTION"}</p>
              <h1 id="profile-name">{p.name}</h1>
              {p.japaneseName && <p className="japanese-name" lang="ja">{p.japaneseName}</p>}
              {p.titles[locale] && <p className="role">{p.titles[locale]}</p>}
              {p.bios[locale] && <p className="bio">{p.bios[locale]}</p>}
              {p.slogan && <p className="slogan">{p.slogan}</p>}
            </div>
          </section>
          <section className="connections" aria-labelledby="connect-title">
            <div className="section-heading"><div><span>CONNECT</span><h2 id="connect-title">{t.connect}</h2></div><p>{t.connectNote}</p></div>
            {contacts ? <div className="contact-grid">
              {p.phone && <ContactCard href={p.phoneHref} icon={<Phone />} label={t.phone} value={p.phone} />}
              {p.email && <ContactCard href={`mailto:${p.email}`} icon={<Mail />} label={t.email} value={p.email} />}
              {p.website && <ContactCard href={p.website} icon={<Globe2 />} label={t.website} value={new URL(p.website).hostname.replace(/^www\./, "")} external />}
              {p.socials.map(social => <ContactCard key={social.name} href={social.href} icon={<SocialIcon name={social.name} />} label={social.name} value={social.alias} external />)}
            </div> : <div className="contact-empty"><Mail size={20} /><span>{t.empty}</span></div>}
          </section>
          <div className="actions"><a className="save-button" href="/contact.vcf" download="nguyen-huu-nhat.vcf"><ArrowDownToLine size={18} />{t.save}</a><p>{t.saveNote}</p><ShareButton title={p.name} labels={{ share: t.share, copied: t.copied, fallback: t.fallback }} /></div>
        </article>
      </main>
      <footer className="footer container"><span><Radio size={13} />{t.footer}</span><span>{p.name}</span></footer>
    </div>
  </>;
}
