'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

type SectorSlug =
  | 'hotels'
  | 'restaurants'
  | 'residential'
  | 'business-centers'
  | 'medical'
  | 'education'
  | 'retail'
  | 'banks';

const SECTORS: SectorSlug[] = [
  'hotels',
  'restaurants',
  'residential',
  'business-centers',
  'medical',
  'education',
  'retail',
  'banks',
];

/* Tiny dark 1×1 JPEG — used as blurDataURL for all sector images */
const BLUR_DATA =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/APUKKKACiiig/9k=';

/* ── Variants ── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easing.smooth },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easing.smooth },
  },
};

/* ── SectorCard ──────────────────────────────────────────────
 *  Параллакс-зум: пока карточка проходит через viewport, фото
 *  внутри плавно зумится (scale 1.05 → 1.18) и слегка едет вверх.
 *  Эффект работает поверх hover-зума — на hover добавляется ещё
 *  +scale через CSS-transition. На mobile (<sm) параллакс выключен
 *  ради perf (offset-расчёты дёшевы, но Lighthouse чувствителен к
 *  layout shifts на медленных GPU).
 * ── */
function SectorCard({ slug }: { slug: SectorSlug }) {
  const t = useTranslations('home.sectors');
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const title: string = t(`cards.${slug}.title`);
  const more: string = t('more');

  /* scroll-progress: 0 когда карточка только-только входит снизу;
     1 когда она уже вышла сверху. На этом окне мапим scale и y. */
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  /* Начинаем чуть зумлёным (1.05), чтобы фото уже заполняло
     края на верхнем краю карточки — без видимых полос. */
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariants}
      className={cn(
        'group relative aspect-video overflow-hidden rounded-md',
        'shadow-card transition-shadow duration-300 hover:shadow-card-hover',
      )}
    >
      {/* Parallax wrapper — двигает фото медленнее карточки */}
      <motion.div
        aria-hidden
        className={cn(
          'absolute inset-0',
          !reduce && 'transition-transform duration-500 group-hover:scale-[1.04]',
        )}
        style={
          reduce
            ? undefined
            : {
                scale: parallaxScale,
                y: parallaxY,
                willChange: 'transform',
                transformOrigin: 'center center',
              }
        }
      >
        <Image
          src={`/images/sectors/${slug}.jpg`}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
          }}
        />
      </motion.div>

      {/* Dark gradient — bottom-heavy for text legibility */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
      />

      {/* Text overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 p-5"
      >
        <h3 className="font-sans text-[17px] font-medium leading-snug text-white sm:text-[18px] lg:text-[19px]">
          {title}
        </h3>

        {/* CTA — slides up + fades in on hover */}
        <div
          className={cn(
            'mt-2 flex items-center gap-1.5',
            'translate-y-2 opacity-0',
            !reduce && 'transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100',
          )}
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/85">
            {more}
          </span>
          <ArrowRight className="h-3 w-3 text-white/85" aria-hidden />
        </div>
      </div>

      {/* Full-card accessible link — sits above everything */}
      <Link
        href={`/sectors/${slug}`}
        className={cn(
          'absolute inset-0 rounded-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0',
        )}
        aria-label={`${title} — ${more}`}
      />
    </motion.article>
  );
}

/* ── SectorsGrid ── */
export function SectorsGrid() {
  const t = useTranslations('home.sectors');
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.05 });

  return (
    <section
      id="sectors"
      aria-labelledby="sectors-heading"
      className={cn(
        'relative isolate overflow-hidden bg-bg-soft section-padding',
        /* Sticky-stack: поднимается над Services (z-20). */
        'lg:sticky lg:top-0 lg:z-[25] lg:min-h-screen',
      )}
    >
      <div className="container mx-auto">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView || reduce ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2
            id="sectors-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-primary lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 4×2 grid: 1-col → 2-col → 4-col */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {SECTORS.map((slug) => (
            <SectorCard key={slug} slug={slug} />
          ))}
        </motion.div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={
            gridInView || reduce
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 12 }
          }
          transition={{ duration: 0.5, ease: easing.smooth, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Link
            href="/sectors"
            className={cn(
              'inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3',
              'text-[14px] font-semibold text-primary',
              'transition-colors duration-200 hover:border-accent hover:text-accent',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            )}
          >
            {t('cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
