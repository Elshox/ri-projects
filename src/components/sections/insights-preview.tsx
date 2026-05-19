'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { INSIGHTS } from '@/lib/data/insights';
import { ArticleCard } from '@/components/ui/article-card';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* Релевантный фон — редакторский рабочий стол с журналами/книгами. */
const BG_PHOTO =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=2000&q=80&auto=format';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing.smooth } },
};

export function InsightsPreview() {
  const t = useTranslations('home.insights');
  const tInsights = useTranslations('insights');
  const locale = useLocale();
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  const previews = INSIGHTS.slice(0, 3);

  return (
    <section
      id="insights"
      aria-labelledby="insights-heading"
      className="relative isolate overflow-hidden bg-bg-soft section-padding"
    >
      <Image
        src={BG_PHOTO}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-[0.10]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(245,241,236,0.86) 0%, rgba(245,241,236,0.93) 100%)',
        }}
      />

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, ease: easing.smooth }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
              {t('eyebrow')}
            </p>
            <h2
              id="insights-heading"
              className="mt-3 font-sans text-h2-m font-semibold text-primary lg:text-h2-d"
            >
              {t('title')}
            </h2>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted lg:text-[17px]">
              {t('subtitle')}
            </p>
          </div>

          <Link
            href="/insights"
            className={cn(
              'group hidden shrink-0 items-center gap-2 sm:flex',
              'text-[15px] font-semibold text-primary',
              'transition-colors duration-200 hover:text-accent',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
            )}
          >
            {t('view_all')}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </motion.div>

        {/* Mobile: горизонтальный snap-scroll. sm+: 2 кол. lg+: 3 кол. */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={containerVariants}
          className={cn(
            'mt-10 flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory',
            '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
            'sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:gap-6 sm:px-0 sm:pb-0 sm:snap-none',
            'lg:grid-cols-3',
          )}
        >
          {previews.map((insight, i) => (
            <motion.div
              key={insight.slug}
              variants={itemVariants}
              className="w-[300px] shrink-0 snap-start sm:w-auto"
            >
              <ArticleCard
                insight={insight}
                locale={locale}
                titleLabel={tInsights(`titles.${insight.slug}`)}
                readMoreLabel={tInsights('read_more')}
                priority={i === 0}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={gridInView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: easing.smooth, delay: 0.5 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            href="/insights"
            className={cn(
              'group inline-flex items-center gap-2',
              'text-[15px] font-semibold text-primary',
              'transition-colors duration-200 hover:text-accent',
            )}
          >
            {t('view_all')}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
