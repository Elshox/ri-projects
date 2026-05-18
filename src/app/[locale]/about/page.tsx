import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { ContactSection } from '@/components/sections/contact-section';
import { PartnersMarquee } from '@/components/sections/partners-marquee';
import { FounderStorySection } from '@/components/sections/founder-story-section';
import { Target, Eye, Zap, Handshake } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const TIMELINE = [
  { year: 2015, event: 'Основание компании. Первый отель в Ташкенте.' },
  { year: 2017, event: 'Выход в Казахстан. Первый проект Marriott.' },
  { year: 2019, event: '50+ реализованных объектов. Собственный склад.' },
  { year: 2021, event: 'Открытие направления сертификации.' },
  { year: 2023, event: 'Hilton Tashkent — флагманский проект.' },
  { year: 2024, event: '200+ фабрик-партнёров. Выход в ОАЭ.' },
] as const;

const VALUE_ICONS = {
  transparency: Target,
  quality: Eye,
  speed: Zap,
  partnership: Handshake,
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const title = t('page_title');
  const description = t('page_subtitle');
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  const valueKeys = ['transparency', 'quality', 'speed', 'partnership'] as const;

  return (
    <>
      <PageHero
        eyebrow={t('page_eyebrow')}
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        breadcrumbs={[{ label: t('breadcrumb') }]}
      />

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-accent">
                {t('mission_eyebrow')}
              </p>
              <h2 className="mb-6 font-serif text-4xl text-primary md:text-5xl">
                {t('mission_title')}
              </h2>
              <p className="font-sans text-lg leading-relaxed text-muted">{t('mission_text')}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {([
                ['50+', 'реализованных проектов'],
                ['8', 'сегментов экспертизы'],
                ['200+', 'фабрик-партнёров'],
                ['10+', 'лет опыта команды'],
              ] as const).map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-card p-6 shadow-card"
                >
                  <p className="font-serif text-4xl font-semibold text-accent">{value}</p>
                  <p className="mt-2 font-sans text-sm text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder story — личный сторителлинг из SMM */}
      <FounderStorySection />

      {/* Values */}
      <section className="bg-bg-soft py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-accent">
            {t('values_eyebrow')}
          </p>
          <h2 className="mb-12 font-sans text-3xl font-semibold text-primary md:text-4xl">
            {t('values_title')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueKeys.map((key) => {
              const Icon = VALUE_ICONS[key];
              return (
                <div key={key} className="rounded-xl bg-white p-6 shadow-card">
                  <Icon className="mb-4 h-8 w-8 text-accent" aria-hidden />
                  <h3 className="mb-2 font-sans text-base font-semibold text-primary">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-muted">
                    {t(`values.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-accent">
            {t('timeline_eyebrow')}
          </p>
          <h2 className="mb-16 font-sans text-3xl font-semibold text-primary md:text-4xl">
            {t('timeline_title')}
          </h2>
          <div className="relative border-l border-border pl-10">
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative mb-10 last:mb-0">
                <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent bg-white" />
                <p className="mb-1 font-sans text-sm font-semibold text-accent">{item.year}</p>
                <p className="font-sans text-base text-muted">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners marquee reuse */}
      <PartnersMarquee />

      <ContactSection />
    </>
  );
}
