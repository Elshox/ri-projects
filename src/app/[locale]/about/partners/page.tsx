import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { PartnersMarquee } from '@/components/sections/partners-marquee';
import { ContactSection } from '@/components/sections/contact-section';
import { Globe, Handshake, Award } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const PARTNER_COUNTRIES = [
  { country: 'Италия', count: 35, flag: '🇮🇹' },
  { country: 'Германия', count: 28, flag: '🇩🇪' },
  { country: 'Турция', count: 42, flag: '🇹🇷' },
  { country: 'Китай', count: 55, flag: '🇨🇳' },
  { country: 'Испания', count: 18, flag: '🇪🇸' },
  { country: 'ОАЭ', count: 12, flag: '🇦🇪' },
  { country: 'Польша', count: 15, flag: '🇵🇱' },
  { country: 'Франция', count: 10, flag: '🇫🇷' },
] as const;

const PARTNERSHIP_BENEFITS = [
  {
    icon: Globe,
    title: 'Прямые договоры',
    desc: 'Работаем напрямую с фабриками без промежуточных дистрибьюторов. Это даёт конкурентную цену и контроль над качеством.',
  },
  {
    icon: Award,
    title: 'Аккредитованные поставщики',
    desc: 'Каждый партнёр прошёл нашу проверку: производственные мощности, качество, надёжность сроков, финансовая стабильность.',
  },
  {
    icon: Handshake,
    title: 'Долгосрочные отношения',
    desc: 'Многолетние партнёрства позволяют получать приоритетные сроки производства и лучшие коммерческие условия.',
  },
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const title = t('partners.page_title');
  const description = t('partners.page_subtitle');
  return {
    title,
    description,
    openGraph: { images: ogImage(title, description) },
    twitter: { images: ogImage(title, description).map((i) => i.url) },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <>
      <PageHero
        eyebrow={t('breadcrumb')}
        title={t('partners.page_title')}
        subtitle={t('partners.page_subtitle')}
        breadcrumbs={[
          { label: t('breadcrumb'), href: '/about' },
          { label: t('partners.breadcrumb') },
        ]}
      />

      {/* Benefits */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {PARTNERSHIP_BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-xl border border-border bg-card p-8 shadow-card">
                  <Icon className="mb-4 h-8 w-8 text-accent" aria-hidden />
                  <h3 className="mb-2 font-sans text-lg font-semibold text-primary">{b.title}</h3>
                  <p className="font-sans text-sm leading-relaxed text-muted">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Geography */}
      <section className="bg-bg-soft py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-10 font-sans text-2xl font-semibold text-primary">
            Поставщики по странам
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PARTNER_COUNTRIES.map((c) => (
              <div
                key={c.country}
                className="flex flex-col items-center rounded-xl border border-border bg-white p-6 text-center shadow-card"
              >
                <span className="mb-2 text-3xl" aria-hidden>
                  {c.flag}
                </span>
                <p className="font-sans text-2xl font-semibold text-accent">{c.count}+</p>
                <p className="font-sans text-sm text-muted">{c.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <PartnersMarquee />

      <ContactSection />
    </>
  );
}
