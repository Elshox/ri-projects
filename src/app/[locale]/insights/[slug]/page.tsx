import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import { notFound } from 'next/navigation';
import { readFile } from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { routing } from '@/i18n/routing';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { ArticleCard } from '@/components/ui/article-card';
import { INSIGHTS, getInsight, CATEGORY_LABELS } from '@/lib/data/insights';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    INSIGHTS.map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'insights' });
  const insight = getInsight(slug);
  if (!insight) return {};
  const title = t(`titles.${slug as 'hotel-ffe-guide'}`);
  return {
    title,
    description: undefined,
    openGraph: {
      images: ogImage(title),
    },
    twitter: { images: ogImage(title).map((i) => i.url) },
  };
}

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

export default async function InsightArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const insight = getInsight(slug);
  if (!insight) notFound();

  const t = await getTranslations({ locale, namespace: 'insights' });

  const mdxPath = path.join(process.cwd(), 'src/content/insights', `${slug}.mdx`);
  let source: string;
  try {
    source = await readFile(mdxPath, 'utf8');
  } catch {
    notFound();
  }

  const title = t(`titles.${slug as 'hotel-ffe-guide'}`);
  const catLabel =
    CATEGORY_LABELS[insight.category]?.[locale as 'ru' | 'en'] ?? insight.category;

  const date = new Date(insight.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  const related = INSIGHTS.filter(
    (i) => i.slug !== slug && i.category === insight.category,
  ).slice(0, 3);

  return (
    <>
      {/* Article hero */}
      <section className="bg-bg-soft pt-32 pb-0">
        <div className="container mx-auto max-w-4xl px-6">
          <BreadcrumbNav
            items={[
              { label: t('breadcrumb'), href: '/insights' },
              { label: title },
            ]}
            className="mb-8"
          />
          <div className="mb-4 flex flex-wrap items-center gap-4 font-sans text-sm text-muted">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">
              {catLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {insight.readingTime} {t('reading_time')}
            </span>
          </div>
          <h1 className="font-serif text-4xl leading-tight text-primary md:text-5xl">{title}</h1>
          <p className="mt-3 font-sans text-sm text-muted">
            {t('author_label')}: {insight.author}
          </p>
        </div>
        {/* Cover */}
        <div className="container mx-auto mt-10 max-w-5xl px-6">
          <div className="relative aspect-video overflow-hidden rounded-t-xl shadow-card-hover">
            <Image
              src={insight.coverImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              placeholder="blur"
              blurDataURL={BLUR}
            />
          </div>
        </div>
      </section>

      {/* MDX content */}
      <article className="py-16">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-sans prose-headings:font-semibold prose-h1:font-serif prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
            <MDXRemote source={source} />
          </div>
        </div>
      </article>

      {/* Back + related */}
      <section className="bg-bg-soft py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <Link
            href={`/${locale}/insights`}
            className="mb-10 inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t('back')}
          </Link>

          {related.length > 0 && (
            <>
              <h2 className="mb-8 font-sans text-xl font-semibold text-primary">
                {/* "Related articles" label (common) */}
                {locale === 'ru' ? 'Похожие материалы' : 'Related articles'}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((ins) => (
                  <ArticleCard
                    key={ins.slug}
                    insight={ins}
                    locale={locale}
                    titleLabel={t(`titles.${ins.slug as 'hotel-ffe-guide'}`)}
                    readMoreLabel={t('read_more')}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
