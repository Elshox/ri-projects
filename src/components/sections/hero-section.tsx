'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  Тайминг (CLAUDE.md §4.2)
 * ───────────────────────────────────────────────────────────── */
const T = {
  WORD_STAGGER: 0.05,   // stagger между словами H1
  WORD_DUR: 0.72,       // длительность одного слова
  TITLE_DELAY: 0.15,    // пауза после появления секции
  SUBTITLE: 0.55,       // после последнего слова H1
  CTA: 0.75,            // CTA после subtitle
  BADGE: 1.0,           // badge в самом конце
  ARROW: 1.25,          // стрелка — последняя
} as const;

/* ─────────────────────────────────────────────────────────────
 *  Motion Variants (объявляем на уровне модуля — не внутри компонента)
 * ───────────────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: T.WORD_STAGGER,
      delayChildren: T.TITLE_DELAY,
    },
  },
};

const wordVariants: Variants = {
  hidden: { y: '115%', rotateX: 8 },
  visible: {
    y: 0,
    rotateX: 0,
    transition: { duration: T.WORD_DUR, ease: easing.smooth },
  },
};

const buildFadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easing.smooth, delay },
  },
});

const subtitleVariants = buildFadeUp(T.SUBTITLE);
const ctaVariants = buildFadeUp(T.CTA);
const badgeVariants = buildFadeUp(T.BADGE);

/* ─────────────────────────────────────────────────────────────
 *  StaggeredHeading — word-by-word reveal с clip-mask
 *  Техника: overflow-hidden-обёртка + translateY(115%) → 0.
 *  SEO: sr-only полный текст, aria-hidden на визуале.
 * ───────────────────────────────────────────────────────────── */
function StaggeredHeading({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Server render + first hydration pass: plain h1, no mismatch
  if (!mounted || reduce) {
    return <h1 className={className}>{text}</h1>;
  }

  const words = text.split(' ');

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {/* Полный текст для скрин-ридеров */}
      <span className="sr-only">{text}</span>

      {/* Визуальный reveal — aria-hidden */}
      <span aria-hidden className="block" style={{ perspective: '800px' }}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.1em] align-bottom"
            style={{ marginRight: i < words.length - 1 ? '0.28em' : 0 }}
          >
            <motion.span
              variants={wordVariants}
              className="inline-block will-change-transform"
              style={{ transformOrigin: 'bottom center' }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.h1>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  ScrollArrow — бесконечный bounce, скрывается при скролле
 * ───────────────────────────────────────────────────────────── */
function ScrollArrow({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 180], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: T.ARROW, duration: 0.6 }}
      className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center sm:bottom-10"
    >
      <motion.span
        aria-label={label}
        role="img"
        animate={reduce ? undefined : { y: [0, 9, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 1.9, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }
        }
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/75 backdrop-blur-sm"
        style={{ WebkitBackdropFilter: 'blur(8px)' }}
      >
        <ChevronDown className="h-5 w-5" aria-hidden />
      </motion.span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  HeroSection
 * ───────────────────────────────────────────────────────────── */
type HeroSectionProps = {
  /**
   * Источник видео-фона. По умолчанию ссылка на Minotti 2025 hero
   * как временный плейсхолдер — будет заменена на собственный mp4
   * (положить в /public/videos/hero.mp4 и поставить '/videos/hero.mp4').
   */
  videoSrc?: string;
  posterSrc?: string;
};

export function HeroSection({
  videoSrc = 'https://idcomplect.ru/upload/iblock/f8d/hyae1szfamfs8oitueo18mklaph5dk3i/radisson_v3_JS.mp4',
  posterSrc = '/images/hero-poster.jpg',
}: HeroSectionProps) {
  const t = useTranslations('home.hero');
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Плавный fade-in видео после загрузки
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Видео крутим на всех экранах (mobile + desktop), object-cover сам
  // обрежет под пропорции секции — пропорции самого видео не меняем.
  // Единственный gate — prefers-reduced-motion: тогда остаётся только постер.
  const showVideo = !reduce;

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────
       *  Pinned background: video + poster + gradient + grain.
       *  position: fixed → остаётся в viewport, пока scroll идёт.
       *  Следующие секции (PainPoints и далее) — opaque и rendered ниже
       *  в DOM, поэтому при скролле они «поднимаются» поверх этого
       *  фиксированного слоя и закрывают его. Точно тот эффект, что
       *  на crowncreative.com.
       *
       *  z-index: -10 удерживает фон под основным потоком; header
       *  (z-40) и все секции остаются над ним.
       * ────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg-dark"
      >
        {/* Слой 1: постер (LCP-приоритет, поверх dark bg) */}
        <Image
          src={posterSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Слой 2: видео — на всех экранах, кроме reduced-motion */}
        {showVideo && (
          <motion.video
            ref={videoRef}
            key="hero-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoLoaded ? 1 : 0 }}
            transition={{ duration: 1.2, ease: easing.smooth }}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
            aria-hidden
            onCanPlayThrough={() => setVideoLoaded(true)}
            style={{ willChange: 'opacity' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        )}

        {/* Слой 3: градиент 35% (spec) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: [
              'linear-gradient(180deg,',
              '  rgba(0,0,0,0.30) 0%,',
              '  rgba(10,6,2,0.42) 40%,',
              '  rgba(10,6,2,0.70) 80%,',
              '  rgba(10,6,2,0.82) 100%',
              ')',
            ].join(''),
          }}
        />

        {/* Слой 4: тонкий grain-шум для premium-текстуры */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />
      </div>

      {/* ──────────────────────────────────────────────────────────────
       *  Hero CONTENT section — нормальный поток, занимает 1 viewport
       *  height. Скроллится естественно: текст уходит вверх, фон
       *  (fixed) остаётся, следующая секция поднимается поверх.
       * ────────────────────────────────────────────────────────────── */}
      <section
        aria-label={t('eyebrow')}
        className="relative flex min-h-[90vh] items-end overflow-hidden text-white lg:min-h-screen"
      >

      {/* ── Контент ──────────────────────────────────────────── */}
      <div className="container mx-auto pb-20 pt-28 sm:pb-24 sm:pt-32">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easing.smooth }}
          className="text-warm-light text-[11px] font-semibold uppercase tracking-[0.28em] sm:text-xs"
        >
          {t('eyebrow')}
        </motion.p>

        {/* H1 — word-by-word reveal.
            Уменьшен на ступень от предыдущей шкалы (34/44/56/72/80)
            → 30/40/52/64/72. Причина: при предыдущей шкале + большой
            heigth viewport CTA-кнопка и badge не помещались в фолд
            на мобилках/планшетах. Заголовок ещё читается крупно,
            но оставляет место остальному контенту. */}
        <StaggeredHeading
          text={t('title')}
          className="mt-4 max-w-[15ch] font-serif text-[30px] leading-[1.08] tracking-[-0.01em] text-white sm:text-[40px] md:text-[52px] lg:text-[64px] xl:text-[72px]"
        />

        {/* Subtitle */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-[16px]"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA кнопки */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={ctaVariants}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18, ease: easing.snappy }}>
            <Link
              href="/contacts"
              className={cn(
                'bg-accent inline-flex items-center justify-center rounded-sm',
                'px-7 py-3.5 text-[14px] font-semibold text-white',
                'transition-opacity duration-200 hover:opacity-90',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
              )}
            >
              {t('cta_primary')}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18, ease: easing.snappy }}>
            <Link
              href="/projects"
              className={cn(
                'inline-flex items-center justify-center rounded-sm',
                'border border-white/35 px-7 py-3.5 text-[14px] font-semibold text-white',
                'transition-colors duration-200 hover:border-white/60 hover:bg-white/[0.08]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
              )}
            >
              {t('cta_secondary')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={badgeVariants}
          className={cn(
            'mt-6 inline-flex items-center gap-2.5 rounded-full',
            'border border-white/[0.12] bg-white/[0.06] px-4 py-[7px]',
            'text-[12px] font-medium text-white/80 backdrop-blur-md sm:text-[13px]',
          )}
          style={{ WebkitBackdropFilter: 'blur(14px)' }}
        >
          {/* Живая точка */}
          <span className="relative inline-flex h-[7px] w-[7px] shrink-0">
            {!reduce && (
              <span
                aria-hidden
                className="bg-warm absolute inset-0 animate-ping rounded-full opacity-50"
              />
            )}
            <span aria-hidden className="bg-warm relative inline-block h-[7px] w-[7px] rounded-full" />
          </span>
          {t('badge')}
        </motion.div>
      </div>

      {/* ── Декоративная вертикальная линия (premium B2B pattern) */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: easing.smooth, delay: 0.8 }}
        style={{ transformOrigin: 'top' }}
        className="pointer-events-none absolute right-10 top-24 hidden h-28 w-px bg-gradient-to-b from-white/0 via-white/25 to-white/0 xl:block"
        aria-hidden
      />

      {/* ── Down-arrow ──────────────────────────────────────── */}
      <ScrollArrow label={t('scroll_hint')} />
      </section>
    </>
  );
}
