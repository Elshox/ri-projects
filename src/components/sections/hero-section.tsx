'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ──────────────────────────────────────────────────────────
 *  Тайминг (CLAUDE.md §4.2 + спецификация задачи)
 *  ──────────────────────────────────────────────────────── */
const TIMING = {
  /** stagger между словами H1 — 50ms (premium B2B стандарт) */
  WORD_STAGGER: 0.05,
  /** длительность движения одного слова */
  WORD_DURATION: 0.7,
  /** задержка перед стартом первого слова, после видеофейда */
  TITLE_DELAY: 0.1,
  /** subtitle появляется через 0.4s после H1 */
  SUBTITLE_DELAY: 0.4,
  /** CTA — через 0.6s */
  CTA_DELAY: 0.6,
  /** badge — через 0.85s */
  BADGE_DELAY: 0.85,
  /** down-arrow появляется в самом конце */
  ARROW_DELAY: 1.1,
} as const;

/* ──────────────────────────────────────────────────────────
 *  Variants — keep top-level and reusable, чтобы Motion
 *  не пересоздавал объекты на каждом рендере.
 *  ──────────────────────────────────────────────────────── */

const lineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: TIMING.WORD_STAGGER,
      delayChildren: TIMING.TITLE_DELAY,
    },
  },
};

const wordVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: 0,
    transition: { duration: TIMING.WORD_DURATION, ease: easing.smooth },
  },
};

const fadeUpDelayed = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing.smooth, delay },
  },
});

/* ──────────────────────────────────────────────────────────
 *  Word-stagger H1
 *  «overflow-hidden + slide up» — самый чистый word reveal,
 *  не создаёт FOUT и работает с любыми шрифтами.
 *  ──────────────────────────────────────────────────────── */

function StaggeredHeading({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={lineVariants}
      transition={reduce ? { duration: 0 } : undefined}
      className={cn(className)}
    >
      {/* SEO/SR-friendly: полный текст для скрин-ридеров */}
      <span className="sr-only">{text}</span>

      <span aria-hidden className="block">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
            style={{ marginRight: i < words.length - 1 ? '0.25em' : 0 }}
          >
            <motion.span variants={wordVariants} className="inline-block will-change-transform">
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.h1>
  );
}

/* ──────────────────────────────────────────────────────────
 *  HeroSection
 *  ──────────────────────────────────────────────────────── */

type HeroSectionProps = {
  /** Путь к видео-фону (desktop). Положи файл в /public/videos/. */
  videoSrc?: string;
  /** Постер для видео + статический фон mobile. /public/images/. */
  posterSrc?: string;
};

export function HeroSection({
  videoSrc = '/videos/hero.mp4',
  posterSrc = '/images/hero-poster.jpg',
}: HeroSectionProps) {
  const t = useTranslations('home.hero');
  const reduce = useReducedMotion();

  // Видео грузим только на md+ — на мобильных оставляем статический постер.
  // Стартуем с false для SSR, чтобы первый рендер совпал с серверным.
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || reduce) return;
    const mq = window.matchMedia('(min-width: 768px)');
    setShowVideo(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setShowVideo(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [reduce]);

  return (
    <section
      className={cn(
        'bg-bg-dark relative isolate flex min-h-[90vh] items-end overflow-hidden text-white lg:min-h-screen',
      )}
      aria-label={t('eyebrow')}
    >
      {/* ── Слой 1: статический постер (всегда рендерится) ───── */}
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover"
        // если файла ещё нет — браузер просто покажет тёмный bg секции
        onError={(event) => {
          (event.currentTarget as HTMLImageElement).style.opacity = '0';
        }}
      />

      {/* ── Слой 2: видео — только на md+ и без reduced-motion ── */}
      {showVideo && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          aria-hidden
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ── Слой 3: 35% gradient overlay (CLAUDE.md spec) ────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* ── Контент ──────────────────────────────────────────── */}
      <div className="container mx-auto pb-24 pt-32 sm:pb-32 sm:pt-40">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easing.smooth }}
          className="text-warm text-xs font-medium uppercase tracking-[0.22em] sm:text-sm"
        >
          {t('eyebrow')}
        </motion.p>

        {/* H1 — word-by-word reveal */}
        <StaggeredHeading
          text={t('title')}
          className="mt-5 max-w-5xl font-serif text-[44px] leading-[1.05] sm:text-6xl lg:text-[80px]"
        />

        {/* Subtitle — delay 0.4s */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUpDelayed(TIMING.SUBTITLE_DELAY)}
          className="mt-7 max-w-2xl text-base text-white/80 sm:text-lg"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA-кнопки — delay 0.6s */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpDelayed(TIMING.CTA_DELAY)}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Link
            href="/contacts"
            className="bg-accent inline-flex items-center justify-center rounded-sm px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('cta_primary')}
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-sm border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('cta_secondary')}
          </Link>
        </motion.div>

        {/* Badge — delay 0.85s */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpDelayed(TIMING.BADGE_DELAY)}
          className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/85 backdrop-blur-md sm:text-[13px]"
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
        >
          <span className="relative inline-flex h-2 w-2 shrink-0">
            {!reduce && (
              <span
                aria-hidden
                className="bg-warm absolute inset-0 animate-ping rounded-full opacity-60"
              />
            )}
            <span aria-hidden className="bg-warm relative inline-block h-2 w-2 rounded-full" />
          </span>
          {t('badge')}
        </motion.div>
      </div>

      {/* ── Down-arrow ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TIMING.ARROW_DELAY, duration: 0.6 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex justify-center sm:bottom-10"
      >
        <motion.span
          aria-label={t('scroll_hint')}
          role="img"
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/80 backdrop-blur-sm"
          style={{ WebkitBackdropFilter: 'blur(6px)' }}
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </motion.div>
    </section>
  );
}
