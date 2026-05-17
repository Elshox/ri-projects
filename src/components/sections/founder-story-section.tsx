'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import { Quote, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  FounderStorySection — личный сторителлинг из SMM-постов:
 *  «Точка А → Ошибка → Поворот → Точка Б». Сильнее всего
 *  работает в /about как блок, отличающий нас от подрядчиков-
 *  безличников. Размещается между Mission и Values: сразу после
 *  «что мы делаем» — почему мы это делаем именно так.
 * ───────────────────────────────────────────────────────────── */

type StepId = 'point_a' | 'mistake' | 'turn' | 'point_b';

const STEPS: { id: StepId; accent: boolean }[] = [
  { id: 'point_a', accent: false },
  { id: 'mistake', accent: true },   // Ошибка — выделена тёплым акцентом
  { id: 'turn',    accent: true },   // Поворот — выделен тёплым акцентом
  { id: 'point_b', accent: false },
];

/* ── Variants ── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing.smooth } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing.smooth } },
};

const closingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing.smooth, delay: 0.3 } },
};

/* ── StoryCard ── */
type StoryCardProps = {
  step: (typeof STEPS)[number];
  index: number;
  t: ReturnType<typeof useTranslations<'about.founder_story'>>;
};

function StoryCard({ step, index, t }: StoryCardProps) {
  const { id, accent } = step;
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        'relative flex flex-col gap-5 rounded-md border p-7 lg:p-8',
        accent
          ? 'border-warm/35 bg-warm/[0.04]'
          : 'border-border bg-card',
      )}
    >
      {/* Большая декоративная цифра в правом верхнем углу */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute right-5 top-3 select-none',
          'font-serif text-[64px] font-medium leading-none lg:text-[80px]',
          accent ? 'text-warm/[0.18]' : 'text-primary/[0.06]',
        )}
      >
        {num}
      </span>

      {/* Label-чип */}
      <span
        className={cn(
          'relative inline-flex w-fit items-center rounded-full px-3 py-[5px]',
          'text-[11px] font-semibold uppercase tracking-[0.18em]',
          accent
            ? 'bg-warm text-white'
            : 'bg-primary/[0.06] text-primary/70',
        )}
      >
        {t(`steps.${id}.label`)}
      </span>

      {/* Заголовок */}
      <h3 className="relative font-serif text-[22px] font-medium leading-snug text-primary lg:text-[26px]">
        {t(`steps.${id}.title`)}
      </h3>

      {/* Body */}
      <p className="relative text-[15px] leading-relaxed text-muted lg:text-[16px]">
        {t(`steps.${id}.body`)}
      </p>
    </motion.article>
  );
}

/* ── FounderStorySection ── */
export function FounderStorySection() {
  const t = useTranslations('about.founder_story');
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.15 });
  const closingInView = useInView(closingRef, { once: true, amount: 0.6 });

  return (
    <section
      aria-labelledby="founder-story-heading"
      className="relative isolate overflow-hidden bg-background py-24 lg:py-32"
    >
      {/* Декоративная тёплая блика-засветка слева, размытая — добавляет
          глубины без отвлекающего фото. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-warm/[0.08] blur-3xl"
      />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView || reduce ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2
            id="founder-story-heading"
            className="mt-3 font-serif text-[36px] font-medium leading-[1.15] text-primary lg:text-[48px]"
          >
            {t('title')}
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted lg:text-[17px]">
            {t('lead')}
          </p>
        </motion.div>

        {/* 4-step grid: 1 col mobile / 2 cols sm / 4 cols lg */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {STEPS.map((step, i) => (
            <StoryCard key={step.id} step={step} index={i} t={t} />
          ))}
        </motion.div>

        {/* Закрывающая цитата */}
        <motion.div
          ref={closingRef}
          initial="hidden"
          animate={closingInView || reduce ? 'visible' : 'hidden'}
          variants={closingVariants}
          className="mt-14 flex flex-col items-center text-center"
        >
          <Quote
            aria-hidden
            className="h-7 w-7 text-warm/60"
            strokeWidth={1.4}
          />
          <p className="mt-4 max-w-2xl font-serif text-[24px] font-medium leading-snug text-primary lg:text-[30px]">
            {t('closing')}
          </p>

          {/* Тонкая декоративная линия */}
          <div
            aria-hidden
            className="mt-7 flex items-center gap-3 opacity-60"
          >
            <span className="h-px w-12 bg-warm/60" />
            <ArrowRight className="h-3 w-3 text-warm" />
            <span className="h-px w-12 bg-warm/60" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
