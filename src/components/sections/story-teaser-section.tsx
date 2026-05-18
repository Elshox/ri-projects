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
import { ArrowRight, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  StoryTeaserSection — короткий cinematic тизер истории
 *  основательницы. Полный сторителлинг живёт в /about, здесь
 *  только хук + цитата + CTA. Premium-ощущение даёт scroll-bound
 *  параллакс фонового фото (scale 1.08 → 1.22, y 0 → -10%) поверх
 *  тёмной градиентной маски.
 * ───────────────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing.smooth } },
};

const highlightVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easing.smooth, delay: 0.35 } },
};

export function StoryTeaserSection() {
  const t = useTranslations('home.story');
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, amount: 0.3 });

  /* Scroll-bound parallax по всему пути секции через viewport.
     На входе фон уже зумлёный (1.08), к выходу — ещё сильнее. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="story-teaser-heading"
      className="relative isolate overflow-hidden bg-bg-dark text-white"
    >
      {/* ── Слой 1: параллакс-фото ─────────────────────────────
          Reduced-motion → статичное фото, никаких transform.
      ── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={
          reduce
            ? undefined
            : {
                scale: bgScale,
                y: bgY,
                willChange: 'transform',
                transformOrigin: 'center center',
              }
        }
      >
        <Image
          src="/images/sectors/restaurants.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          quality={85}
        />
      </motion.div>

      {/* ── Слой 2: тёмный градиент — текст должен читаться ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            'linear-gradient(180deg,',
            '  rgba(10,6,2,0.55) 0%,',
            '  rgba(10,6,2,0.72) 45%,',
            '  rgba(10,6,2,0.86) 100%',
            ')',
          ].join(''),
        }}
      />

      {/* ── Слой 3: тонкий grain — premium-текстура ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* ── Контент ──────────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-24 sm:py-32 lg:py-40">
        <motion.div
          ref={contentRef}
          initial="hidden"
          animate={contentInView || reduce ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mx-auto max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.p
            variants={itemVariants}
            className="text-warm-light text-[11px] font-semibold uppercase tracking-[0.28em]"
          >
            {t('eyebrow')}
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={itemVariants}
            id="story-teaser-heading"
            className="mt-5 font-serif text-[36px] font-medium leading-[1.1] tracking-[-0.01em] text-white sm:text-[44px] lg:text-[56px]"
          >
            {t('headline')}
          </motion.h2>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/70 lg:text-[17px]"
          >
            {t('subline')}
          </motion.p>

          {/* Highlight quote — выделена в отдельную карточку */}
          <motion.div
            initial="hidden"
            animate={contentInView || reduce ? 'visible' : 'hidden'}
            variants={highlightVariants}
            className={cn(
              'relative mt-10 border-l-2 border-warm pl-6',
              'max-w-xl',
            )}
          >
            <Quote
              aria-hidden
              className="absolute -left-[14px] top-0 h-6 w-6 rounded-full bg-bg-dark p-[3px] text-warm"
              strokeWidth={1.6}
            />
            <p className="font-serif text-[22px] font-medium leading-snug text-white lg:text-[26px]">
              {t('highlight')}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-10">
            <motion.div
              whileHover={reduce ? undefined : { x: 2 }}
              transition={{ duration: 0.18, ease: easing.snappy }}
              className="inline-block"
            >
              <Link
                href="/about"
                className={cn(
                  'group inline-flex items-center gap-2.5 rounded-sm',
                  'border border-white/35 bg-white/[0.04] px-7 py-3.5',
                  'text-[14px] font-semibold text-white backdrop-blur-sm',
                  'transition-colors duration-200',
                  'hover:border-white/60 hover:bg-white/[0.10]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                )}
              >
                {t('cta')}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
