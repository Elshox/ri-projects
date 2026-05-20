'use client';

import { useRef } from 'react';
import Image from 'next/image';
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
import { ScrollDots } from '@/components/ui/scroll-dots';

/* ─────────────────────────────────────────────────────────────
 *  ProcessTimeline — 4 этапа работы, обычная сетка.
 *
 *  Раскладка:
 *  • Mobile  (<sm):  1 колонка
 *  • Tablet  (sm+):  2 колонки
 *  • Desktop (lg+):  4 колонки в ряд
 *
 *  Каждая карточка = фото + step-of-N + заголовок + описание + срок.
 *  Анимация только stagger-reveal при появлении в viewport.
 * ───────────────────────────────────────────────────────────── */

type StepId = 'analysis' | 'selection' | 'proposal' | 'delivery';

type StepMeta = {
  id: StepId;
  Icon: LucideIcon;
  /** Релевантное Unsplash-фото — визуально объясняет шаг. */
  photo: string;
};

const STEPS: readonly StepMeta[] = [
  {
    id: 'analysis',
    Icon: FileSearch,
    /* Архитектурные чертежи / разбор задачи */
    photo:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format',
  },
  {
    id: 'selection',
    Icon: Sparkles,
    /* Бизнес-рукопожатие = заключение партнёрства с поставщиком */
    photo:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format',
  },
  {
    id: 'proposal',
    Icon: FileText,
    /* Рабочий стол с ноутбуком и документами */
    photo:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format',
  },
  {
    id: 'delivery',
    Icon: PackageCheck,
    /* Логистика / склад / поставка */
    photo:
      'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1200&q=80&auto=format',
  },
];

const STEP_COUNT = STEPS.length;

/* ── Variants ── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing.smooth } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing.smooth } },
};

/* ── StepCard ── */
type StepCardProps = {
  step: StepMeta;
  index: number;
  t: ReturnType<typeof useTranslations<'home.process'>>;
};

function StepCard({ step, index, t }: StepCardProps) {
  const { Icon, photo, id } = step;
  const num = String(index + 1).padStart(2, '0');
  const reduce = useReducedMotion();

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card',
        'shadow-card transition-shadow duration-300 hover:shadow-card-hover',
      )}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={photo}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={cn(
            'object-cover',
            !reduce && 'transition-transform duration-700 group-hover:scale-105',
          )}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />
        <span
          aria-hidden
          className="absolute bottom-3 left-5 font-serif text-[64px] font-medium leading-none text-white drop-shadow-lg sm:text-[72px]"
        >
          {num}
        </span>
        <span
          aria-hidden
          className={cn(
            'absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full',
            'border border-white/40 bg-white/15 text-white backdrop-blur-md',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-warm">
          {t('step_of', { current: index + 1, total: STEP_COUNT })}
        </p>
        <h3 className="font-serif text-[22px] font-medium leading-snug text-primary lg:text-[24px]">
          {t(`steps.${id}.title`)}
        </h3>
        <p className="text-[14px] leading-relaxed text-muted">
          {t(`steps.${id}.desc`)}
        </p>
        <div className="mt-auto pt-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1">
            <Clock className="h-3 w-3 text-warm" aria-hidden />
            <span className="text-[12px] font-medium text-muted">
              {t(`steps.${id}.time`)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── ProcessTimeline ── */
export function ProcessTimeline() {
  const t = useTranslations('home.process');
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative bg-bg-soft section-padding"
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
            id="process-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-primary lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Mobile: горизонтальный snap-scroll. sm+: 2 кол. lg+: 4 в ряд. */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className={cn(
            'mt-12 flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory',
            '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
            'sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:gap-6 sm:px-0 sm:pb-0 sm:snap-none',
            'lg:grid-cols-4 lg:gap-5',
          )}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className="w-[300px] shrink-0 snap-start sm:w-auto"
            >
              <StepCard step={step} index={i} t={t} />
            </div>
          ))}
        </motion.div>

        {/* Индикатор горизонтального скролла — только мобиль */}
        <ScrollDots scrollRef={gridRef} count={STEPS.length} tone="light" />
      </div>
    </section>
  );
}
