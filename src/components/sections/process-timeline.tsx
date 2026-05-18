'use client';

import { useRef } from 'react';
import Image from 'next/image';
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
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  ProcessTimeline — 4 этапа работы.
 *
 *  • Mobile / Tablet (<lg): обычный горизонтальный snap-scroll
 *    карусель (свайп пальцем).
 *  • Desktop (lg+):  pinned horizontal scroll — секция приклеивается
 *                    к viewport, и 4 карточки автоматически едут
 *                    вбок по мере вертикального скролла страницы.
 *                    Премиум-эффект Apple/Stripe.
 *
 *  Реализация horizontal (desktop):
 *  ─ внешняя <section> h-[400vh] на lg → 4 viewport-высоты runway
 *  ─ внутри sticky-контейнер top-0 h-screen держит viewport
 *  ─ useScroll({ target: section, offset: ['start start','end end'] })
 *    даёт scrollYProgress 0→1
 *  ─ useTransform мапит 0→1 на x: 0% → -75% (= 3 шага по 25%)
 *  ─ useSpring сглаживает x — кинематографично, без рывков
 *
 *  Внутри pinned-area pin БЕЗОПАСЕН: после Process идут Insights,
 *  Contact и Footer — обычным потоком, без sticky. Никакие
 *  «теряющиеся» секции.
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
    /* Бизнес-рукопожатие = заключение партнёрства с поставщиком.
       Чёткий смысл: «выбираем и договариваемся с фабриками». */
    photo:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80&auto=format',
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
 *  Используется и в mobile-rail, и в desktop-pinned-rail.
 * ───────────────────────────────────────────────────────────── */
type StepCardProps = {
  step: StepMeta;
  index: number;
  t: ReturnType<typeof useTranslations<'home.process'>>;
  variant: 'mobile' | 'desktop';
};

function StepCard({ step, index, t, variant }: StepCardProps) {
  const { Icon, photo, id } = step;
  const num = String(index + 1).padStart(2, '0');
  const reduce = useReducedMotion();

  const isDesktop = variant === 'desktop';

  return (
    <motion.article
      variants={variant === 'mobile' ? cardVariants : undefined}
      className={cn(
        'group relative flex shrink-0 flex-col overflow-hidden rounded-md border border-border bg-card',
        'shadow-card transition-shadow duration-300 hover:shadow-card-hover',
        isDesktop
          ? 'w-full max-w-[520px]'
          : 'w-[300px] sm:w-[360px]',
      )}
      style={isDesktop ? undefined : { scrollSnapAlign: 'start' }}
    >
      {/* Photo — релевантный визуал шага */}
      <div className={cn('relative overflow-hidden', isDesktop ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        <Image
          src={photo}
          alt=""
          fill
          sizes={isDesktop ? '520px' : '(max-width: 640px) 80vw, 360px'}
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
          className="absolute bottom-3 left-5 font-serif text-[68px] font-medium leading-none text-white drop-shadow-lg sm:text-[80px]"
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
      <div className="flex flex-1 flex-col gap-3 p-6 lg:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-warm">
          {t('step_of', { current: index + 1, total: STEP_COUNT })}
        </p>
        <h3 className="font-serif text-[24px] font-medium leading-snug text-primary lg:text-[28px]">
          {t(`steps.${id}.title`)}
        </h3>
        <p className="text-[14px] leading-relaxed text-muted lg:text-[15px]">
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

/* ─────────────────────────────────────────────────────────────
 *  Desktop pinned horizontal timeline
 * ───────────────────────────────────────────────────────────── */
type DesktopRailProps = {
  t: ReturnType<typeof useTranslations<'home.process'>>;
  scrollProgress: MotionValue<number>;
};

function DesktopRail({ t, scrollProgress }: DesktopRailProps) {
  const reduce = useReducedMotion();

  /* x: 0% → -75% покрывает все 4 слайда (1-й виден на старте,
     4-й — в конце). Spring сглаживает рывки. */
  const xRaw = useTransform(scrollProgress, [0, 1], ['0%', '-75%']);
  const x = useSpring(xRaw, { stiffness: 90, damping: 22, mass: 0.4 });

  /* Прогресс-бар: ширина = scrollProgress × 100% */
  const progressWidth = useTransform(scrollProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
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

        {/* Progress bar (continuous) */}
        <div className="mt-8 h-px w-full max-w-md overflow-hidden bg-border">
          <motion.div
            aria-hidden
            style={reduce ? { width: '100%' } : { width: progressWidth }}
            className="h-full origin-left bg-warm"
          />
        </div>
      </div>

      {/* Horizontal sliding cards */}
      <div className="relative flex flex-1 items-center overflow-hidden py-12">
        <motion.div
          style={reduce ? undefined : { x }}
          /* 4 cards × 25% each, padding-left/right даёт отступы по краям */
          className="flex w-[400%] items-stretch gap-0 px-[12vw]"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className="flex w-[25%] flex-shrink-0 items-center justify-center px-4 xl:px-6"
            >
              <StepCard step={step} index={i} t={t} variant="desktop" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Mobile horizontal snap-scroll carousel
 * ───────────────────────────────────────────────────────────── */
function MobileCarousel({ t }: { t: ReturnType<typeof useTranslations<'home.process'>> }) {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const inView = useInView(railRef, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={railRef}
      initial="hidden"
      animate={inView || reduce ? 'visible' : 'hidden'}
      variants={railVariants}
      className={cn(
        'mt-12 overflow-x-auto overflow-y-hidden',
        '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
      )}
      style={{ scrollSnapType: 'x mandatory' }}
    >
      <div className="flex gap-5 px-6 pb-4 sm:px-8">
        {STEPS.map((step, i) => (
          <StepCard key={step.id} step={step} index={i} t={t} variant="mobile" />
        ))}
        <div aria-hidden className="w-6 shrink-0 sm:w-12" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  ProcessTimeline (entry)
 * ───────────────────────────────────────────────────────────── */
export function ProcessTimeline() {
  const t = useTranslations('home.process');
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });

  /* useScroll по всей секции:
     scrollYProgress = 0 когда верх section касается верха viewport
     scrollYProgress = 1 когда низ section касается низа viewport
     Внутри этого окна sticky-контейнер виден и x ползёт от 0 до -75%. */
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
        /* Mobile/tablet (<lg): обычная высота, padding в контейнере */
        /* Desktop (lg+): длинная section даёт runway для horizontal scroll.
           400vh ≈ 100vh sticky + 3 viewport-высоты runway = по ~1 viewport
           на каждую из 3-х переходов между 4-мя шагами.
           Reduced-motion → секция короче, sticky не нужен. */
        reduce ? 'lg:h-auto' : 'lg:h-[400vh]',
      )}
    >
      {/* ── Mobile / Tablet (<lg) — обычный snap-scroll ── */}
      <div className="container mx-auto px-6 py-20 lg:hidden">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView || reduce ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="mx-auto mb-2 max-w-2xl text-center"
        >
          <p className="text-warm text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-sans text-h2-m font-semibold text-primary">
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            {t('subtitle')}
          </p>
          <div
            aria-hidden
            className="mt-6 flex items-center justify-center gap-2 text-[12px] uppercase tracking-[0.22em] text-muted/70"
          >
            <span>{t('scroll_hint')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </motion.div>
        <MobileCarousel t={t} />
      </div>

      {/* ── Desktop (lg+) pinned horizontal ── */}
      <div
        className={cn(
          'hidden lg:block',
          reduce ? '' : 'lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden',
        )}
      >
        {reduce ? (
          /* Reduced-motion → статичный 4-up grid */
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
            <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
              {STEPS.map((step, i) => (
                <StepCard key={step.id} step={step} index={i} t={t} variant="desktop" />
              ))}
            </div>
          </div>
        ) : (
          <DesktopRail t={t} scrollProgress={scrollYProgress} />
        )}
      </div>
    </section>
  );
}
