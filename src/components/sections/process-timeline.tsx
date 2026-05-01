'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import {
  FileSearch,
  Sparkles,
  FileText,
  PackageCheck,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ── Step data ── */
type StepId = 'analysis' | 'selection' | 'proposal' | 'delivery';

const STEPS: { id: StepId; Icon: LucideIcon }[] = [
  { id: 'analysis',  Icon: FileSearch   },
  { id: 'selection', Icon: Sparkles     },
  { id: 'proposal',  Icon: FileText     },
  { id: 'delivery',  Icon: PackageCheck },
];

/* ── Motion variants ──────────────────────────────────────────
 *  Flat items array [step, line, step, line, step, line, step]
 *  → staggerChildren animates them sequentially.
 * ── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing.smooth } },
};

/* ── ConnectorLine ────────────────────────────────────────────
 *  Two inner motion.divs: one for mobile (scaleY), one for desktop (scaleX).
 *  Only the visible one is rendered (lg:hidden / hidden lg:block).
 *  Both inherit the parent's hidden/visible state via variant propagation.
 * ── */
function ConnectorLine() {
  /* Wrapper: empty variants so stagger timing still passes through */
  const wrapVariants: Variants = { hidden: {}, visible: {} };

  const mobileLineVariants: Variants = {
    hidden: { scaleY: 0 },
    visible: { scaleY: 1, transition: { duration: 0.35, ease: easing.smooth } },
  };

  const desktopLineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.45, ease: easing.smooth } },
  };

  return (
    <motion.div
      variants={wrapVariants}
      /* self-start so it doesn't stretch vertically on desktop flex-row */
      className="flex-shrink-0 self-start"
    >
      {/* Mobile: vertical line — ml-7 (28px) centres it under the 56px circle */}
      <motion.div
        variants={mobileLineVariants}
        className="ml-7 h-12 w-px origin-top bg-border lg:hidden"
      />
      {/* Desktop: horizontal line — mt-10 (40px) aligns with centre of 80px number */}
      <motion.div
        variants={desktopLineVariants}
        className="mt-10 hidden h-px w-10 origin-left bg-border lg:block xl:w-16"
      />
    </motion.div>
  );
}

/* ── StepItem ── */
type StepItemProps = {
  step: (typeof STEPS)[number];
  index: number;
  t: ReturnType<typeof useTranslations<'home.process'>>;
};

function StepItem({ step, index, t }: StepItemProps) {
  const { Icon } = step;
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      variants={stepVariants}
      className="flex flex-row items-start gap-5 lg:flex-1 lg:flex-col lg:items-center lg:gap-0"
    >
      {/* ── Mobile indicator: icon circle + number badge ── */}
      <div className="relative flex-shrink-0 lg:hidden">
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full',
            'border-2 border-accent/25 bg-accent/[0.07]',
          )}
        >
          <Icon className="h-5 w-5 text-accent" strokeWidth={1.6} />
        </div>
        <span
          aria-hidden
          className={cn(
            'absolute -right-2 -top-2',
            'flex h-6 w-6 items-center justify-center rounded-full',
            'bg-accent text-[11px] font-bold text-white',
          )}
        >
          {index + 1}
        </span>
      </div>

      {/* ── Desktop indicator: large decorative number + icon centred over it ── */}
      <div className="relative hidden items-center justify-center lg:flex">
        {/* Large muted number — purely decorative */}
        <span
          aria-hidden
          className="select-none font-serif text-[80px] font-medium leading-none text-primary/[0.06]"
        >
          {num}
        </span>
        {/* Icon circle — absolutely centred on the number */}
        <div
          className={cn(
            'absolute flex h-12 w-12 items-center justify-center rounded-full',
            'border-2 border-accent/25 bg-accent/[0.07]',
          )}
        >
          <Icon className="h-5 w-5 text-accent" strokeWidth={1.6} />
        </div>
      </div>

      {/* ── Content (shared) ── */}
      <div className="flex-1 pb-1 lg:mt-7 lg:flex-none lg:px-3 lg:text-center">
        <h3 className="font-sans text-[17px] font-semibold leading-snug text-primary lg:text-[18px]">
          {t(`steps.${step.id}.title`)}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted lg:text-[15px]">
          {t(`steps.${step.id}.desc`)}
        </p>

        {/* Duration badge */}
        <div
          className={cn(
            'mt-4 inline-flex items-center gap-1.5',
            'rounded-full border border-border bg-background px-3 py-1',
          )}
        >
          <Clock className="h-3 w-3 text-warm" aria-hidden />
          <span className="text-[12px] font-medium text-muted">
            {t(`steps.${step.id}.time`)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── ProcessTimeline ── */
export function ProcessTimeline() {
  const t = useTranslations('home.process');
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.15 });

  /* Build flat items array: [step, line, step, line, step, line, step] */
  type Item =
    | { type: 'step'; id: string; step: (typeof STEPS)[number]; index: number }
    | { type: 'line'; id: string };

  const items: Item[] = [];
  STEPS.forEach((step, i) => {
    items.push({ type: 'step', id: step.id, step, index: i });
    if (i < STEPS.length - 1) {
      items.push({ type: 'line', id: `line-${i}` });
    }
  });

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="bg-bg-soft section-padding"
    >
      <div className="container mx-auto">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, ease: easing.smooth }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2
            id="process-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-primary lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Timeline — flex-col on mobile, flex-row on desktop */}
        <motion.div
          ref={timelineRef}
          initial="hidden"
          animate={timelineInView || reduce ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mt-14 flex flex-col lg:flex-row lg:items-start"
        >
          {items.map((item) =>
            item.type === 'step' ? (
              <StepItem key={item.id} step={item.step} index={item.index} t={t} />
            ) : (
              <ConnectorLine key={item.id} />
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
