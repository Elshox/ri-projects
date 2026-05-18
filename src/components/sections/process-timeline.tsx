'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
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

/* ─────────────────────────────────────────────────────────────
 *  ProcessTimeline — 4 этапа работы.
 *
 *  • Mobile (<lg):   вертикальный таймлайн со stagger-reveal
 *                    (как раньше).
 *  • Desktop (lg+):  pinned horizontal scroll — секция приклеивается
 *                    к viewport, и 4 карточки едут вбок по мере
 *                    вертикального скролла. Премиум-эффект Apple/
 *                    Stripe, классика для процессов.
 *
 *  Реализация horizontal:
 *  ─ внешняя <section> имеет h-[420vh] на lg → даёт runway скролла
 *  ─ внутри sticky-контейнер top-0 h-screen держит viewport
 *  ─ useScroll({ target: section, offset: ['start start','end end'] })
 *    даёт scrollYProgress 0→1
 *  ─ useTransform мапит 0→1 на x: 0% → -75% (= 3 шага по 25% ширины)
 *  ─ useSpring сглаживает x — без рывков, кинематографично
 *
 *  Прогресс-индикатор сверху (4 точки) подсвечивает текущий шаг.
 * ───────────────────────────────────────────────────────────── */

/* ── Step data ── */
type StepId = 'analysis' | 'selection' | 'proposal' | 'delivery';

const STEPS: { id: StepId; Icon: LucideIcon }[] = [
  { id: 'analysis',  Icon: FileSearch   },
  { id: 'selection', Icon: Sparkles     },
  { id: 'proposal',  Icon: FileText     },
  { id: 'delivery',  Icon: PackageCheck },
];

const STEP_COUNT = STEPS.length;

/* ─────────────────────────────────────────────────────────────
 *  Shared StepCard — используется и на mobile, и на desktop
 *  с разной размерной раскладкой через className.
 * ───────────────────────────────────────────────────────────── */
type StepCardProps = {
  step: (typeof STEPS)[number];
  index: number;
  t: ReturnType<typeof useTranslations<'home.process'>>;
  variant: 'mobile' | 'desktop';
};

function StepCard({ step, index, t, variant }: StepCardProps) {
  const { Icon } = step;
  const num = String(index + 1).padStart(2, '0');

  if (variant === 'mobile') {
    return (
      <div className="flex flex-row items-start gap-5">
        {/* Icon circle + numbered badge */}
        <div className="relative flex-shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/25 bg-accent/[0.07]">
            <Icon className="h-5 w-5 text-accent" strokeWidth={1.6} />
          </div>
          <span
            aria-hidden
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white"
          >
            {index + 1}
          </span>
        </div>

        <div className="flex-1 pb-1">
          <h3 className="font-sans text-[17px] font-semibold leading-snug text-primary">
            {t(`steps.${step.id}.title`)}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            {t(`steps.${step.id}.desc`)}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1">
            <Clock className="h-3 w-3 text-warm" aria-hidden />
            <span className="text-[12px] font-medium text-muted">
              {t(`steps.${step.id}.time`)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* Desktop variant — larger, vertical layout inside fixed-width slide.
     overflow-hidden на внешнем wrapper'е критичен: без него гигантский
     декоративный номер (180px) вылезает за карточку и накладывается на
     соседние ячейки в reduced-motion grid fallback. */
  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden px-8 xl:px-16">
      <div className="relative max-w-md">
        {/* Decorative big number behind. Опущен ниже, чуть мельче чем
            был — чтобы descender'ы не задевали title и не вылезали из
            ячейки в grid-fallback (1/4 ширины контейнера). */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 left-0 select-none font-serif text-[140px] font-medium leading-none text-primary/[0.05] xl:text-[180px]"
        >
          {num}
        </span>

        {/* Icon circle */}
        <div
          className={cn(
            'relative flex h-16 w-16 items-center justify-center rounded-full',
            'border-2 border-accent/30 bg-accent/[0.08]',
          )}
        >
          <Icon className="h-6 w-6 text-accent" strokeWidth={1.6} />
        </div>

        {/* Eyebrow — step number + total */}
        <p className="relative mt-8 text-[12px] font-semibold uppercase tracking-[0.22em] text-warm">
          {t('step_of', { current: index + 1, total: STEP_COUNT })}
        </p>

        {/* Title */}
        <h3 className="relative mt-3 font-serif text-[34px] font-medium leading-[1.15] text-primary xl:text-[40px]">
          {t(`steps.${step.id}.title`)}
        </h3>

        {/* Description */}
        <p className="relative mt-5 text-[16px] leading-relaxed text-muted xl:text-[17px]">
          {t(`steps.${step.id}.desc`)}
        </p>

        {/* Duration badge */}
        <div className="relative mt-7 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5">
          <Clock className="h-3.5 w-3.5 text-warm" aria-hidden />
          <span className="text-[13px] font-medium text-muted">
            {t(`steps.${step.id}.time`)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Mobile vertical timeline (with stagger + connecting lines)
 * ───────────────────────────────────────────────────────────── */
const mobileContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
};

const mobileStepVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing.smooth } },
};

const mobileLineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.35, ease: easing.smooth } },
};

function MobileTimeline({ t }: { t: ReturnType<typeof useTranslations<'home.process'>> }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView || reduce ? 'visible' : 'hidden'}
      variants={mobileContainerVariants}
      className="flex flex-col"
    >
      {STEPS.map((step, i) => (
        <div key={step.id}>
          <motion.div variants={mobileStepVariants}>
            <StepCard step={step} index={i} t={t} variant="mobile" />
          </motion.div>
          {i < STEPS.length - 1 && (
            <motion.div
              variants={mobileLineVariants}
              aria-hidden
              className="ml-7 h-12 w-px origin-top bg-border"
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Desktop pinned horizontal timeline
 * ───────────────────────────────────────────────────────────── */
type DesktopTimelineProps = {
  t: ReturnType<typeof useTranslations<'home.process'>>;
  scrollProgress: MotionValue<number>;
};

function DesktopTimeline({ t, scrollProgress }: DesktopTimelineProps) {
  const reduce = useReducedMotion();

  /* Каждый шаг = 25% ширины ленты. Сдвиг с 0 до -75% покрывает
     все 4 слайда (1-й уже виден на старте, 4-й — в конце). */
  const xRaw = useTransform(scrollProgress, [0, 1], ['0%', '-75%']);
  /* Спринг чуть сглаживает рывки колеса мыши, не делает skid. */
  const x = useSpring(xRaw, { stiffness: 90, damping: 22, mass: 0.4 });

  /* Прогресс-бар: ширина = scrollProgress * 100% */
  const progressWidth = useTransform(scrollProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="flex h-full flex-col">
      {/* ── Top: header + progress strip ── */}
      <div className="container mx-auto flex flex-col items-center px-6 pt-20">
        <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
          {t('eyebrow')}
        </p>
        <h2
          id="process-heading"
          className="mt-3 text-center font-sans text-h2-d font-semibold text-primary"
        >
          {t('title')}
        </h2>
        <p className="mt-4 max-w-2xl text-center text-[17px] leading-relaxed text-muted">
          {t('subtitle')}
        </p>

        {/* Progress strip with 4 dots */}
        <div className="mt-10 flex w-full max-w-md items-center gap-3">
          {/* Numbers row */}
          <div className="flex flex-1 items-center">
            {STEPS.map((s, i) => {
              /* Каждая точка активна когда scrollProgress >= i/(N-1).
                 На последнем шаге все 4 светятся. */
              const threshold = STEP_COUNT > 1 ? i / (STEP_COUNT - 1) : 0;
              return (
                <DotIndicator
                  key={s.id}
                  index={i}
                  scrollProgress={scrollProgress}
                  threshold={threshold}
                  isLast={i === STEPS.length - 1}
                />
              );
            })}
          </div>
        </div>

        {/* Continuous progress bar under dots */}
        <div className="mt-3 h-px w-full max-w-md overflow-hidden bg-border">
          <motion.div
            aria-hidden
            style={reduce ? { width: '100%' } : { width: progressWidth }}
            className="h-full origin-left bg-warm"
          />
        </div>
      </div>

      {/* ── Horizontal sliding cards ── */}
      <div className="relative flex flex-1 items-center overflow-hidden">
        <motion.div
          style={reduce ? undefined : { x }}
          className="flex w-[400%] items-stretch"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className="flex w-[25%] items-center justify-start"
            >
              <StepCard step={step} index={i} t={t} variant="desktop" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* Один индикатор шага — точка + соединительная линия справа */
type DotIndicatorProps = {
  index: number;
  scrollProgress: MotionValue<number>;
  threshold: number;
  isLast: boolean;
};

function DotIndicator({ scrollProgress, threshold, isLast }: DotIndicatorProps) {
  /* Активность: 1 если прогресс достиг threshold-0.02, иначе 0.3 */
  const dotScale = useTransform(scrollProgress, (v) => (v >= threshold - 0.02 ? 1.15 : 1));
  const dotOpacity = useTransform(scrollProgress, (v) => (v >= threshold - 0.02 ? 1 : 0.35));

  return (
    <div className="flex flex-1 items-center">
      <motion.div
        style={{ scale: dotScale, opacity: dotOpacity }}
        transition={{ duration: 0.2, ease: easing.snappy }}
        className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-warm"
      />
      {!isLast && <div className="ml-2 h-px flex-1 bg-border" />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  ProcessTimeline (entry)
 * ───────────────────────────────────────────────────────────── */
export function ProcessTimeline() {
  const t = useTranslations('home.process');
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);

  /* useScroll по всей секции:
     scrollYProgress = 0 когда верх section касается верха viewport,
     scrollYProgress = 1 когда низ section касается низа viewport.
     Внутри этого окна sticky-контейнер виден. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      className={cn(
        'bg-bg-soft relative',
        /* Mobile/tablet: обычная высота через padding в контейнере */
        /* Desktop: длинная section даёт runway для horizontal scroll.
           420vh = 100vh sticky + ~3.2 viewport-высоты runway.
           Reduced-motion → секция короче, sticky отключаем CSS-ом ниже. */
        reduce ? 'lg:h-auto' : 'lg:h-[420vh]',
      )}
    >
      {/* ── Mobile / Tablet (<lg) ── */}
      <div className="container mx-auto px-6 py-20 lg:hidden">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-sans text-h2-m font-semibold text-primary">
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            {t('subtitle')}
          </p>
        </div>
        <MobileTimeline t={t} />
      </div>

      {/* ── Desktop (lg+) pinned horizontal ──
          Если reduced-motion — sticky отключаем, рендерим как
          обычную полноширотную секцию с 4 карточками в ряд.
      ── */}
      <div
        className={cn(
          'hidden lg:block',
          reduce ? '' : 'lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden',
        )}
      >
        {reduce ? (
          /* Statically rendered 4-up grid for reduced-motion users */
          <div className="container mx-auto px-6 py-24">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
                {t('eyebrow')}
              </p>
              <h2
                id="process-heading"
                className="mt-3 font-sans text-h2-d font-semibold text-primary"
              >
                {t('title')}
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">
                {t('subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <StepCard key={step.id} step={step} index={i} t={t} variant="desktop" />
              ))}
            </div>
          </div>
        ) : (
          <DesktopTimeline t={t} scrollProgress={scrollYProgress} />
        )}
      </div>
    </section>
  );
}
