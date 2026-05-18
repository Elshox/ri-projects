import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ogImage } from '@/lib/og';
import { PageHero } from '@/components/ui/page-hero';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ContactSection } from '@/components/sections/contact-section';
import { SERVICES, getService } from '@/lib/data/services';
import { getProject } from '@/lib/data/projects';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  const name = t(`slugs.${slug as 'turnkey'}`);
  const desc = t(`subtitles.${slug as 'turnkey'}`);
  return {
    title: name,
    description: desc,
    openGraph: { images: ogImage(name, desc) },
    twitter: { images: ogImage(name, desc).map((i) => i.url) },
  };
}

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = getService(slug);
  if (!service) notFound();

  const t = await getTranslations({ locale, namespace: 'services' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const name = t(`slugs.${service.slug}`);
  const subtitle = t(`subtitles.${service.slug}`);
  const relatedProject = getProject(service.relatedCase);

  return (
    <>
      <PageHero
        eyebrow={t('breadcrumb')}
        title={name}
        subtitle={subtitle}
        bgImage={service.heroImage}
        breadcrumbs={[
          { label: t('breadcrumb'), href: '/services' },
          { label: name },
        ]}
      />

      {/* What's included */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-sans text-2xl font-semibold text-primary md:text-3xl">
            {t('what_included_title')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.includes.map((item) => {
              const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[item.icon];
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-border bg-card p-6 shadow-card"
                >
                  {IconComponent && (
                    <IconComponent className="mb-4 h-6 w-6 text-accent" aria-hidden />
                  )}
                  <h3 className="mb-2 font-sans text-base font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related case */}
      {relatedProject && (
        <section className="bg-bg-soft py-24">
          <div className="container mx-auto max-w-7xl px-6">
            <h2 className="mb-10 font-sans text-2xl font-semibold text-primary md:text-3xl">
              {t('featured_case_title')}
            </h2>
            <div className="grid overflow-hidden rounded-xl shadow-card md:grid-cols-2">
              <div className="relative aspect-[4/3] bg-bg-dark md:aspect-auto">
                {relatedProject.heroImage && (
                  <Image
                    src={relatedProject.heroImage}
                    alt={relatedProject.client}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={BLUR}
                  />
                )}
              </div>
              <div className="flex flex-col justify-center bg-white p-8 lg:p-12">
                <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
                  {relatedProject.city} · {relatedProject.year}
                </p>
                <h3 className="mb-4 font-sans text-2xl font-semibold text-primary">
                  {relatedProject.client}
                </h3>
                <p className="mb-6 font-sans text-sm leading-relaxed text-muted">
                  {relatedProject.context}
                </p>
                <div className="mb-8 grid grid-cols-2 gap-4">
                  {relatedProject.results.slice(0, 4).map((r) => (
                    <div key={r.label}>
                      <p className="font-serif text-2xl font-semibold text-accent">{r.value}</p>
                      <p className="font-sans text-xs text-muted">{r.label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/${locale}/projects/${relatedProject.slug}`}
                  className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent hover:underline"
                >
                  {tCommon('view_project')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-24">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="mb-10 font-sans text-2xl font-semibold text-primary md:text-3xl">
            {t('faq_title')}
          </h2>
          <FAQAccordion items={service.faq} />
        </div>
      </section>

      {/* CTA */}
      <ContactSection />
    </>
  );
}
