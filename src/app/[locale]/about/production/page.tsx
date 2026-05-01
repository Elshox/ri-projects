import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { ContactSection } from '@/components/sections/contact-section';
import { Factory, Package, ShieldCheck, Wrench } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const CAPABILITIES = [
  {
    icon: Factory,
    title: 'Кастомное производство',
    desc: 'Собственные партнёрские мощности в Китае и Турции позволяют изготавливать мебель по эксклюзивным спецификациям клиента: нестандартные размеры, брендинг, уникальные материалы.',
  },
  {
    icon: Package,
    title: 'Складской комплекс',
    desc: 'Собственный склад площадью 3 000 м² в Ташкенте. Ответственное хранение, кросс-докинг, комплектация под объект с маркировкой по локациям.',
  },
  {
    icon: ShieldCheck,
    title: 'Контроль качества',
    desc: 'Инспекция на производстве до отгрузки, входной контроль на складе, дефектовка при сдаче объекта. Все отклонения фиксируются и устраняются до сдачи.',
  },
  {
    icon: Wrench,
    title: 'Монтажные бригады',
    desc: 'Собственные и партнёрские монтажные команды по всему СНГ. Координируем сборку, расстановку и юстировку мебели и оборудования.',
  },
] as const;

const CERTIFICATIONS = [
  'ISO 9001:2015 — Система менеджмента качества',
  'ТР ЕАЭС 025/2012 — Мебель',
  'ГОСТ Р 51773 — Торговые объекты',
  'СТБ EN 1335 — Офисная мебель',
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const title = t('production.page_title');
  const description = t('production.page_subtitle');
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

export default async function ProductionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <>
      <PageHero
        eyebrow={t('breadcrumb')}
        title={t('production.page_title')}
        subtitle={t('production.page_subtitle')}
        breadcrumbs={[
          { label: t('breadcrumb'), href: '/about' },
          { label: t('production.breadcrumb') },
        ]}
      />

      {/* Capabilities */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="flex gap-5 rounded-xl border border-border bg-card p-8 shadow-card"
                >
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" aria-hidden />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 font-sans text-lg font-semibold text-primary">
                      {cap.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-muted">{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-bg-soft py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-8 font-sans text-2xl font-semibold text-primary">Сертификаты</h2>
          <div className="flex flex-wrap gap-3">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 shadow-card"
              >
                <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
                <span className="font-sans text-sm text-primary">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
