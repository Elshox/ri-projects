import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { ProjectCard } from '@/components/ui/project-card';
import { ContactSection } from '@/components/sections/contact-section';
import { SECTORS, getSector } from '@/lib/data/sectors';
import { getProject } from '@/lib/data/projects';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SECTORS.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'sectors' });
  const name = t(`slugs.${slug as 'hotels'}`);
  const description = t(`subtitles.${slug as 'hotels'}`);
  return {
    title: name,
    description,
    openGraph: { images: ogImage(name, description) },
    twitter: { images: ogImage(name, description).map((i) => i.url) },
  };
}

export default async function SectorDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const sector = getSector(slug);
  if (!sector) notFound();

  const t = await getTranslations({ locale, namespace: 'sectors' });
  const tProjects = await getTranslations({ locale, namespace: 'projects' });

  const name = t(`slugs.${sector.slug}`);
  const subtitle = t(`subtitles.${sector.slug}`);

  const relatedProjects = sector.relatedCases
    .map(getProject)
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <>
      {/* Eyebrow раньше дублировал breadcrumb — убран. */}
      <PageHero
        title={name}
        subtitle={subtitle}
        bgImage={sector.heroImage}
        breadcrumbs={[
          { label: t('breadcrumb'), href: '/sectors' },
          { label: name },
        ]}
      />

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-sans text-2xl font-semibold text-primary md:text-3xl">
            {t('features_title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {sector.features.map((feature) => {
              const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[feature.icon];
              return (
                <div key={feature.title} className="flex flex-col">
                  {IconComponent && (
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <IconComponent className="h-6 w-6 text-accent" aria-hidden />
                    </div>
                  )}
                  <h3 className="mb-2 font-sans text-lg font-semibold text-primary">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-muted">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we supply */}
      <section className="bg-bg-soft py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-sans text-2xl font-semibold text-primary md:text-3xl">
            {t('supply_title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sector.supply.map((cat) => (
              <div key={cat.category} className="rounded-lg border border-border bg-white p-6 shadow-card">
                <h3 className="mb-4 font-sans text-base font-semibold text-primary">
                  {cat.category}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-sans text-sm text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-10 font-sans text-2xl font-semibold text-primary md:text-3xl">
            {t('standards_title')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {sector.standards.map((std) => (
              <span
                key={std}
                className="rounded-full border border-border px-4 py-2 font-sans text-sm text-primary"
              >
                {std}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related cases */}
      {relatedProjects.length > 0 && (
        <section className="bg-bg-soft py-24">
          <div className="container mx-auto max-w-7xl px-6">
            <h2 className="mb-12 font-sans text-2xl font-semibold text-primary md:text-3xl">
              {t('cases_title')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                  viewLabel={tProjects('view_project')}
                  priority={i === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <ContactSection />
    </>
  );
}
