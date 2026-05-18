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
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  ProcessTimeline — 4 этапа работы в одной горизонтальной ленте.
 *
 *  Mobile + desktop: snap-scroll горизонтальная карусель.
 *  Пользователь свайпает / прокручивает колесом по X.
 *  Каждая карточка = шаг с релевантным фото сверху.
 *
 *  Раньше тут был desktop-only pinned-horizontal scroll, но он
 *  блокировал нижние секции страницы (пользователь жаловался),
 *  поэтому теперь — обычный snap-scroll, без приклеивания.
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
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80&auto=format',
  },
  {
    id: 'selection',
    Icon: Sparkles,
    /* Образцы материалов на столе */
    photo:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&auto=format',
  },
  {
    id: 'proposal',
    Icon: FileText,
    /* Рабочий стол с ноутбуком и документами */
    photo:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80&auto=format',
  },
  {
    id: 'delivery',
    Icon: PackageCheck,
    /* Логистика / склад / поставка */
    photo:
      'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1600&q=80&auto=format',
  },
];

const STEP_COUNT = STEPS.length;

/* ── Variants ── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing.smooth } },
};

const railVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing.smooth } },
};

/* ─────────────────────────────────────────────────────────────
 *  StepCard — карточка одного этапа: фото сверху + контент снизу.
 *  Фиксированная ширина — обеспечивает чёткий snap.
 * ───────────────────────────────────────────────────────────── */
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
        'group relative flex shrink-0 flex-col overflow-hidden rounded-md border border-border bg-card',
        'shadow-card transition-shadow duration-300 hover:shadow-card-hover',
        /* Ширина: ~80% viewport на мобиле / фиксированная на desktop */
        'w-[300px] sm:w-[360px] lg:w-[420px] xl:w-[460px]',
      )}
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Photo — релевантный визуал шага */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={photo}
          alt=""
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 360px, 460px"
          className={cn(
            'object-cover',
            !reduce && 'transition-transform duration-700 group-hover:scale-105',
          )}
        />
        {/* Bottom-darken gradient под номер */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />
        {/* Большой номер шага в углу фото */}
        <span
          aria-hidden
          className="absolute bottom-3 left-5 font-serif text-[68px] font-medium leading-none text-white drop-shadow-lg sm:text-[80px]"
        >
          {num}
        </span>
        {/* Иконка в правом верхнем углу */}
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
      <div className="flex flex-1 flex-col gap-3 p-6 lg:p-7">
        {/* Eyebrow — шаг N из M */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-warm">
          {t('step_of', { current: index + 1, total: STEP_COUNT })}
        </p>

        {/* Title */}
        <h3 className="font-serif text-[24px] font-medium leading-snug text-primary lg:text-[26px]">
          {t(`steps.${id}.title`)}
        </h3>

        {/* Description */}
        <p className="text-[14px] leading-relaxed text-muted lg:text-[15px]">
          {t(`steps.${id}.desc`)}
        </p>

        {/* Duration badge */}
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

/* ─────────────────────────────────────────────────────────────
 *  ProcessTimeline (entry)
 * ───────────────────────────────────────────────────────────── */
export function ProcessTimeline() {
  const t = useTranslations('home.process');
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const railInView = useInView(railRef, { once: true, amount: 0.1 });

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative bg-bg-soft section-padding"
    >
      {/* Header */}
      <div className="container mx-auto">
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

        {/* Hint: горизонтальный скролл (только если хватает места показать
            больше чем 1 карточку — на маленьких экранах знак убираем) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView || reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: easing.smooth }}
          className="mt-6 flex items-center justify-center gap-2 text-[12px] uppercase tracking-[0.22em] text-muted/70"
          aria-hidden
        >
          <span>{t('scroll_hint')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.div>
      </div>

      {/* Horizontal rail */}
      <motion.div
        ref={railRef}
        initial="hidden"
        animate={railInView || reduce ? 'visible' : 'hidden'}
        variants={railVariants}
        className={cn(
          'mt-12 overflow-x-auto overflow-y-hidden',
          /* Скрываем скроллбар кросс-браузер */
          '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
        )}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-5 px-6 pb-4 sm:px-8 lg:gap-7 lg:px-12 xl:px-20">
          {STEPS.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} t={t} />
          ))}
          {/* Финальный спейсер — даёт последней карточке возможность
              отскроллиться к началу (snap='start' иначе не сработает). */}
          <div aria-hidden className="w-6 shrink-0 sm:w-12 lg:w-24" />
        </div>
      </motion.div>
    </section>
  );
}
