'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
  type Variants,
} from 'motion/react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* Релевантный фон — премиальный современный офис.
   Стат-цифры работают «весомее» на dark + текстурном фоне. */
const BG_PHOTO =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80&auto=format';

/* ── Data (numbers live here; labels come from i18n) ── */
type StatId = 'projects' | 'sectors' | 'partners' | 'experience';

const STATS: { id: StatId; target: number; suffix: string }[] = [
  { id: 'projects',   target: 50,  suffix: '+' },
  { id: 'sectors',    target: 8,   suffix: ''  },
  { id: 'partners',   target: 200, suffix: '+' },
  { id: 'experience', target: 10,  suffix: '+' },
];

/* ── Variants ── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing.smooth } },
};

/* ── Counter
 *  Uses Motion's animate() to drive a useMotionValue from 0 → target,
 *  then useTransform rounds it reactively — no setInterval, no state churn.
 * ── */
type CounterProps = {
  target: number;
  suffix: string;
  label: string;
  inView: boolean;
  isFirst: boolean;
};

function Counter({ target, suffix, label, inView, isFirst }: CounterProps) {
  const reduce = useReducedMotion();

  /* Motion value starts at 0; animate() drives it to target when in view */
  const count = useMotionValue(0);

  /* Reactively convert the raw float to a rounded integer for display */
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(count, target, {
      duration: 1.5,
      ease: easing.smooth,
    });
    return controls.stop;
  }, [inView, reduce, count, target]);

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'flex flex-col items-center gap-3 px-4 text-center lg:px-10',
        /* Vertical rule между сиблингами на desktop — тонкая белая
           для dark-темы. */
        !isFirst && 'lg:border-l lg:border-white/[0.12]',
      )}
    >
      {/* Number + suffix */}
      <div className="font-serif text-[56px] font-medium leading-none tracking-[-0.02em] text-white lg:text-[72px]">
        {/* Screen reader gets the final value; visual content is aria-hidden */}
        <span className="sr-only">{target}{suffix} {label}</span>
        {reduce ? (
          /* No animation for reduced-motion users — just show final value */
          <span aria-hidden>{target}{suffix}</span>
        ) : (
          <span aria-hidden className="inline-flex items-baseline">
            <motion.span>{rounded}</motion.span>
            {suffix && (
              <span className="ml-0.5 font-serif text-warm-light text-[40px] lg:text-[52px]">
                {suffix}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Label — aria-hidden because sr-only span above already contains the full text */}
      <p aria-hidden className="max-w-[12ch] text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 lg:text-[12px]">
        {label}
      </p>
    </motion.div>
  );
}

/* ── StatsSection ── */
export function StatsSection() {
  const t = useTranslations('home.stats');
  const reduce = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  /* Single inView for the whole grid — all counters start together */
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      aria-labelledby="stats-heading"
      className="relative isolate overflow-hidden bg-bg-dark section-padding"
    >
      {/* Фон секции — модернистская офисная архитектура */}
      <Image
        src={BG_PHOTO}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-35"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,6,2,0.78) 0%, rgba(10,6,2,0.88) 100%)',
        }}
      />

      <div className="container mx-auto">

        {/* Header — переоформлены как USP-блок (фидбек колеги 2:
            «не понятно чем отличаемся в деньгах/сроках»). Эти 4 цифры
            и есть наша дифференциация. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.65, ease: easing.smooth }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="text-warm-light text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2
            id="stats-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-white lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-white/70 lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 2×2 mobile → 4-col desktop */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView || reduce ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-y-0"
        >
          {STATS.map(({ id, target, suffix }, i) => (
            <Counter
              key={id}
              target={target}
              suffix={suffix}
              label={t(id)}
              inView={inView}
              isFirst={i === 0}
            />
          ))}
        </motion.div>

        {/* Decorative bottom rule — dark theme */}
        <div className="mt-14 flex items-center gap-4" aria-hidden>
          <span className="h-px flex-1 bg-white/[0.12]" />
          <span className="h-2 w-2 rounded-full bg-warm/70" />
          <span className="h-px flex-1 bg-white/[0.12]" />
        </div>
      </div>
    </section>
  );
}
