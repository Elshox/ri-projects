import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { ProjectCard } from '@/components/ui/project-card';
import { ContactSection } from '@/components/sections/contact-section';
import { PROJECTS, getProject } from '@/lib/data/projects';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.client} — ${project.city} ${project.year}`;
  return {
    title,
    description: project.context,
    openGraph: { images: ogImage(title) },
    twitter: { images: ogImage(title).map((i) => i.url) },
  };
}

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const t = await getTranslations({ locale, namespace: 'projects' });

  const similar = PROJECTS.filter(
    (p) => p.sector === project.sector && p.slug !== project.slug,
  ).slice(0, 3);

  return (
    <>
      {/* Hero — only render Image if heroImage is set; otherwise dark gradient bg */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-bg-dark">
        {project.heroImage && (
        <Image
          src={project.heroImage}
          alt={project.client}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
        />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-bg-dark/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container mx-auto max-w-7xl px-6 pb-12">
          <BreadcrumbNav
            items={[
              { label: t('breadcrumb'), href: '/projects' },
              { label: project.client },
            ]}
            className="mb-6 [&_*]:text-white/60 [&_a:hover]:!text-white [&_.text-primary]:!text-white"
          />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-accent">
                {project.sector} · {project.city} · {project.year}
              </p>
              <h1 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl">
                {project.client}
              </h1>
            </div>
            <div className="flex flex-wrap gap-4 font-sans text-sm text-white/70">
              <span>{t('area_label')}: {project.area.toLocaleString()} м²</span>
            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="border-b border-border py-4">
        <div className="container mx-auto max-w-7xl px-6">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {tCommon('back_to_list')}
          </Link>
        </div>
      </div>

      {/* Context + Challenge + Solution */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-3">
            <div>
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
                {t('context_label')}
              </p>
              <p className="font-sans text-base leading-relaxed text-muted">{project.context}</p>
            </div>
            <div>
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
                {t('challenge_label')}
              </p>
              <p className="font-sans text-base leading-relaxed text-muted">{project.challenge}</p>
            </div>
            <div>
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
                {t('solution_label')}
              </p>
              <p className="font-sans text-base leading-relaxed text-muted">{project.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-bg-dark py-20 text-white">
        <div className="container mx-auto max-w-7xl px-6">
          <p className="mb-10 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
            {t('results_label')}
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {project.results.map((r) => (
              <div key={r.label}>
                <p className="font-serif text-4xl font-semibold text-accent md:text-5xl">{r.value}</p>
                <p className="mt-2 font-sans text-sm text-white/60">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.galleryImages.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <p className="mb-8 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
              {t('gallery_label')}
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {project.galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={[
                    'relative overflow-hidden rounded-lg',
                    i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square',
                  ].join(' ')}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL={BLUR}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {project.brands.length > 0 && (
        <section className="bg-bg-soft py-16">
          <div className="container mx-auto max-w-7xl px-6">
            <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
              {t('brands_label')}
            </p>
            <div className="flex flex-wrap gap-3">
              {project.brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-border bg-white px-5 py-2 font-sans text-sm font-medium text-primary shadow-card"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar projects */}
      {similar.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <p className="mb-8 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
              {tCommon('related_projects')}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  locale={locale}
                  viewLabel={t('view_project')}
                  priority={i === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection />
    </>
  );
}
