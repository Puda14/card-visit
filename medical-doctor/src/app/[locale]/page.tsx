import { ArrowDownToLine, ArrowUpRight, BookOpen, Building2, CalendarDays, Globe2, GraduationCap, Mail, MapPin, Phone, Stethoscope, Radio, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { profile as p } from "@/lib/profile";
import { dictionaries, isLocale, languageNames, locales } from "@/lib/i18n";
import { MedicalCross, JointIllustration } from "@/components/medical-mark";
import { CurtainIntro } from "@/components/curtain-intro";
import { Avatar } from "@/components/avatar";
import { ShareButton } from "@/components/share-button";
import { SocialIcon } from "@/components/social-icon";

export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export const dynamicParams = false;
function Contact({ href, icon, label, value, external = false }: { href: string; icon: ReactNode; label: string; value: string; external?: boolean }) {
  return <a className="contact-card" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
    <span className="contact-icon">{icon}</span><span className="contact-text"><small>{label}</small><strong>{value}</strong></span><ArrowUpRight size={17} className="contact-arrow" aria-hidden="true" />
  </a>;
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionaries[locale];
  const hasContacts = p.phone || p.email || p.website || p.socials.length;
  return <>
    <CurtainIntro slogan={p.slogans[locale]} skipLabel={t.skip} welcome={t.intro} />
    <div id="site-content">
      <div className="ambient" aria-hidden="true"><span /><span /></div>
      <a className="skip-link" href="#main">{t.skipContent}</a>
      <header className="header container">
        <a className="brand" href={`/${locale}`}><span className="brand-mark"><MedicalCross /></span><span>{p.titles[locale]}<small>{p.specialties[locale]}</small></span></a>
        <nav className="language-switch" aria-label={t.language}><Globe2 size={15} aria-hidden="true" />{locales.map(language => <a key={language} href={`/${language}`} hrefLang={language} lang={language} aria-label={languageNames[language]} aria-current={locale === language ? "page" : undefined}>{language === "ja" ? "日本語" : language.toUpperCase()}</a>)}</nav>
      </header>
      <main id="main" className="container">
        <article className="profile-panel" aria-labelledby="profile-name">
          <div className="card-topline"><span><Stethoscope size={16} aria-hidden="true" />{t.profile}</span><span className="care-dot" aria-hidden="true"><i /> CARE & CONNECTION</span></div>
          <div className="profile-overview">
            <div className={`visual-panel${p.avatar ? " has-portrait" : ""}`}>
              <div className="visual-orbit" aria-hidden="true" />
              {p.avatar ? <Avatar src={p.avatar} name={p.name} /> : <JointIllustration />}
              <span className="visual-cross"><MedicalCross /></span>
              <div className="visual-caption"><span>{p.titles[locale]}</span><small>{p.specialties[locale]}</small></div>
            </div>
            <div className="identity">
              <p className="eyebrow"><span />{t.eyebrow}</p>
              <p className="doctor-title">{p.titles[locale]}</p>
              <h1 id="profile-name">{p.name}</h1>
              {p.japaneseName && <p className="japanese-name" lang="ja">{p.japaneseName}</p>}
              <div className="specialty"><Stethoscope size={18} aria-hidden="true" /><span>{p.specialties[locale]}</span></div>
              <blockquote><span aria-hidden="true">“</span>{p.slogans[locale]}</blockquote>
              <div className="professional-profile" aria-label={t.care}>
                <div><GraduationCap aria-hidden="true" /><p><small>{t.degree}</small><strong>{p.professional.degree[locale]}</strong></p></div>
                <div><Stethoscope aria-hidden="true" /><p><small>{t.training}</small><strong>{p.professional.training[locale]}</strong></p></div>
                <div><BookOpen aria-hidden="true" /><p><small>{t.expertise}</small><strong>{p.professional.expertise[locale]}</strong></p></div>
                <div><Building2 aria-hidden="true" /><p><small>{t.workplace}</small>{p.workplaceUrl ? <a href={p.workplaceUrl} target="_blank" rel="noopener noreferrer">{p.professional.workplace[locale]}<ArrowUpRight aria-hidden="true" /></a> : <strong>{p.professional.workplace[locale]}</strong>}</p></div>
              </div>
            </div>
          </div>
          <div className="connections">
            <div className="contact-heading"><div><span className="section-label">CONNECT</span><h2>{t.contact}</h2></div><p>{t.contactNote}</p></div>
            {hasContacts ? <div className="contact-grid">
              {p.phone && <Contact href={p.phoneHref} icon={<Phone size={20} />} label={t.phone} value={p.phone} />}
              {p.email && <Contact href={`mailto:${p.email}`} icon={<Mail size={20} />} label={t.email} value={p.email} />}
              {p.website && <Contact href={p.website} icon={<Globe2 size={20} />} label={t.website} value={new URL(p.website).hostname.replace(/^www\./, "")} external />}
              {p.socials.map(social => <Contact key={social.name} href={social.href} icon={<SocialIcon name={social.name} />} label={social.name} value={social.alias} external />)}
            </div> : <div className="contact-empty"><Mail size={21} aria-hidden="true" /><p>{t.empty}</p><ArrowRight size={18} aria-hidden="true" /></div>}
            {(p.address || p.map) && <div className="location"><MapPin size={18} aria-hidden="true" /><span><small>{t.location}</small>{p.address}</span>{p.map && <a href={p.map} target="_blank" rel="noopener noreferrer">{t.directions}<ArrowUpRight size={15} /></a>}</div>}
            <section className="related-info" aria-labelledby="related-heading">
              <div className="related-heading"><div><span className="section-label">REFERENCES</span><h3 id="related-heading">{t.related}</h3></div><p>{t.relatedNote}</p></div>
              <div className="related-grid">
                {p.relatedLinks.map(link => {
                  const details = link.key === "rheumatology"
                    ? { label: t.authorProfile, source: "Hội Thấp khớp học Việt Nam", icon: <BookOpen aria-hidden="true" /> }
                    : link.key === "mskCenter"
                      ? { label: t.articles, source: "Viện Cơ Xương Khớp - Bệnh viện Bạch Mai", icon: <Stethoscope aria-hidden="true" /> }
                      : link.key === "ifr"
                        ? { label: t.instituteProfile, source: "IFR", icon: <Building2 aria-hidden="true" /> }
                        : { label: t.examinationSchedule, source: "Bệnh viện Đa khoa Quốc tế Hải Phòng", icon: <CalendarDays aria-hidden="true" /> };
                  return <a key={link.key} className="related-card" href={link.href} target="_blank" rel="noopener noreferrer">
                    <span>{details.icon}</span><p><small>{details.label}</small><strong>{details.source}</strong></p><ArrowUpRight aria-hidden="true" />
                  </a>;
                })}
              </div>
            </section>
          </div>
          <div className="profile-actions"><a className="button-primary" href="/contact.vcf" download="doctor-contact.vcf"><ArrowDownToLine size={18} aria-hidden="true" />{t.save}</a><p>{t.saveNote}</p><ShareButton title={p.name} labels={{ share: t.share, copied: t.copied, fallback: t.fallback }} /></div>
        </article>
      </main>
      <footer className="footer container"><span><Radio size={14} aria-hidden="true" />{t.footer}</span><span>{p.name}</span></footer>
    </div>
  </>;
}
