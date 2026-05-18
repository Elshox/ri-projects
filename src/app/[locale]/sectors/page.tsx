import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { SECTORS } from '@/lib/data/sectors';
import { ArrowRight } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sectors' });
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

export default async function SectorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'sectors' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <PageHero
        eyebrow={tNav('sectors')}
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        breadcrumbs={[{ label: t('breadcrumb') }]}
      />

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...SECTORS]
              .sort((a, b) => a.priority - b.priority)
              .map((sector) => {
                const name = t(`slugs.${sector.slug}`);
                const subtitle = t(`subtitles.${sector.slug}`);
                return (
                  <Link
                    key={sector.slug}
                    href={`/${locale}/sectors/${sector.slug}`}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <div className="relative aspect-[3/4] bg-bg-dark">
                      {sector.heroImage && (
                        <Image
                          src={sector.heroImage}
                          alt={name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                          placeholder="blur"
                          blurDataURL={BLUR}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/85 via-bg-dark/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <h2 className="mb-1 font-sans text-base font-semibold text-white">
                          {name}
                        </h2>
                        <p className="mb-3 font-sans text-xs leading-relaxed text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {subtitle}
                        </p>
                        <div className="flex items-center gap-1 font-sans text-xs font-semibold text-accent">
                          {t('features_title')}
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                            aria-hidden
                          />
                        </div>
                      </div>
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
