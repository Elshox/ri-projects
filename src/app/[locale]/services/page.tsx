import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ogImage } from '@/lib/og';
import { PageHero } from '@/components/ui/page-hero';
import { SERVICES } from '@/lib/data/services';
import { ArrowRight, Boxes, Armchair, Package, Truck, ShieldCheck } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Boxes, Armchair, Package, Truck, ShieldCheck,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return {
    title: t('page_title'),
    description: t('page_subtitle'),
    openGraph: { images: ogImage(t('page_title'), t('page_subtitle')) },
    twitter: { images: ogImage(t('page_title'), t('page_subtitle')).map((i) => i.url) },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'services' });

  return (
    <>
      <PageHero
        eyebrow={t('page_eyebrow')}
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        breadcrumbs={[{ label: t('breadcrumb') }]}
      />

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = ICON_MAP[service.icon] ?? Boxes;
              const name = t(`slugs.${service.slug}`);
              const subtitle = t(`subtitles.${service.slug}`);

              return (
                <Link
                  key={service.slug}
                  href={`/${locale}/services/${service.slug}`}
                  className="group relative flex flex-col rounded-lg border border-border bg-card p-8 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
                >
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: service.color }} />
                  </div>
                  <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mb-3 font-sans text-xl font-semibold text-primary">{name}</h2>
                  <p className="flex-1 font-sans text-sm leading-relaxed text-muted">{subtitle}</p>
                  <div className="mt-6 flex items-center gap-1 font-sans text-sm font-semibold text-accent">
                    {t('what_included_title')}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
