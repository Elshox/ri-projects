import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { InsightMeta } from '@/lib/data/insights';
import { CATEGORY_LABELS } from '@/lib/data/insights';

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

type ArticleCardProps = {
  insight: InsightMeta;
  locale: string;
  titleLabel: string;
  readMoreLabel: string;
  priority?: boolean;
};

export function ArticleCard({
  insight,
  locale,
  titleLabel,
  readMoreLabel,
  priority = false,
}: ArticleCardProps) {
  const catLabel =
    CATEGORY_LABELS[insight.category]?.[locale as 'ru' | 'en'] ??
    insight.category;

  const date = new Date(insight.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <Link
        href={`/${locale}/insights/${insight.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${readMoreLabel}: ${insight.slug}`}
      />
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={insight.coverImage}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          placeholder="blur"
          blurDataURL={BLUR}
          priority={priority}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3 font-sans text-xs text-muted">
          <span className="rounded bg-bg-soft px-2 py-0.5 font-semibold text-accent">
            {catLabel}
          </span>
          <span>{date}</span>
          <span aria-hidden>·</span>
          <span>{insight.readingTime} мин</span>
        </div>
        <h3 className="flex-1 font-sans text-base font-semibold leading-snug text-primary">
          {titleLabel}
        </h3>
        <div className="mt-4 flex items-center gap-1 font-sans text-sm font-medium text-accent">
          {readMoreLabel}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}
