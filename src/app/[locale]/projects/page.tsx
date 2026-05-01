import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { ProjectsGrid } from './projects-grid';
import { PROJECTS, PROJECT_CITIES, PROJECT_SECTORS, PROJECT_YEARS } from '@/lib/data/projects';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
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

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'projects' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const filterAll = t('filter_all');

  return (
    <>
      <PageHero
        eyebrow={tNav('projects')}
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        breadcrumbs={[{ label: t('breadcrumb') }]}
      />

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-bg-soft" />}>
            <ProjectsGrid
              locale={locale}
              projects={PROJECTS as unknown as typeof PROJECTS}
              sectors={PROJECT_SECTORS}
              years={PROJECT_YEARS}
              cities={PROJECT_CITIES}
              labels={{
                filterAll,
                filterSector: t('filter_sector'),
                filterYear: t('filter_year'),
                filterCity: t('filter_city'),
                filterReset: t('filter_reset'),
                viewProject: t('view_project'),
                noResults: t('no_results'),
              }}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
