import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { ArticleCard } from '@/components/ui/article-card';
import { INSIGHTS } from '@/lib/data/insights';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'insights' });
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

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'insights' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <PageHero
        eyebrow={tNav('insights')}
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        breadcrumbs={[{ label: t('breadcrumb') }]}
      />

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INSIGHTS.map((insight, i) => (
              <ArticleCard
                key={insight.slug}
                insight={insight}
                locale={locale}
                titleLabel={t(`titles.${insight.slug}`)}
                readMoreLabel={t('read_more')}
                priority={i < 3}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
