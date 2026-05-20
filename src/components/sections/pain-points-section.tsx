'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import {
  Clock,
  TrendingDown,
  FileWarning,
  AlertTriangle,
  Users,
  Hourglass,
  ImageOff,
  Receipt,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';
import { ScrollDots } from '@/components/ui/scroll-dots';

/* Релевантный фон секции (Unsplash) — фотография стройки/ремонта
   объекта в процессе. Подкрепляет нарратив «вот что бывает, когда
   нет системы». Заменить на свой ассет, когда будет готов. */
const BG_PHOTO =
  'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=2000&q=80&auto=format';

/* ─────────────────────────────────────────────────────────────
 *  Pain points — восемь болей проектной комплектации, которые мы
 *  закрываем. Первые 5 — operational (сроки, бюджет, таможня,
 *  качество, переговоры). Последние 3 (8) добавлены из SMM-постов:
 *  срок службы FF&E, подбор «по картинке», скрытый +30% бюджет.
 *  Размещается между Hero и Services: «agitate the problem before
 *  showing the solution» — классический premium-B2B паттерн.
 * ───────────────────────────────────────────────────────────── */

type PainKey =
  | 'delivery_slip'
  | 'budget_overrun'
  | 'customs_chaos'
  | 'quality_mismatch'
  | 'negotiation_drain'
  | 'short_lifespan'
  | 'blind_picking'
  | 'hidden_overruns';

const PAINS: { key: PainKey; Icon: LucideIcon }[] = [
  { key: 'delivery_slip',    Icon: Clock          },
  { key: 'budget_overrun',   Icon: TrendingDown   },
  { key: 'customs_chaos',    Icon: FileWarning    },
  { key: 'quality_mismatch', Icon: AlertTriangle  },
  { key: 'negotiation_drain', Icon: Users         },
  { key: 'short_lifespan',   Icon: Hourglass      },
  { key: 'blind_picking',    Icon: ImageOff       },
  { key: 'hidden_overruns',  Icon: Receipt        },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing.smooth } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easing.smooth } },
};

/* ── Card ─────────────────────────────────────────────────── */

type PainCardProps = {
  pain: (typeof PAINS)[number];
};

function PainCard({ pain }: PainCardProps) {
  const t = useTranslations('home.pains.points');
  const { key, Icon } = pain;

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        /* Тёмная стеклянная карточка поверх dark bg + фото:
           полупрозрачный белый фон, тонкий белый бордер, blur.
           h-full → выравнивание по самой высокой карточке в ряду
           (для горизонтальной карусели на мобиле и грида на desktop). */
        'group relative flex h-full flex-col gap-4 rounded-md border border-white/[0.12] bg-white/[0.04] p-6',
        'backdrop-blur-md transition-colors duration-300 hover:border-warm/50 hover:bg-white/[0.07]',
      )}
      style={{ WebkitBackdropFilter: 'blur(12px)' }}
    >
      <span
        aria-hidden
        className={cn(
          'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm',
          'bg-warm/15 text-warm-light transition-colors duration-300',
          'group-hover:bg-warm group-hover:text-white',
        )}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
      </span>

      <div>
        <h3 className="text-[16px] font-medium leading-snug text-white lg:text-[17px]">
          {t(`${key}.title`)}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-white/70 lg:text-[15px]">
          {t(`${key}.desc`)}
        </p>
      </div>
    </motion.article>
  );
}

/* ── Section ──────────────────────────────────────────────── */

export function PainPointsSection() {
  const t = useTranslations('home.pains');
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section
      id="pains"
      aria-labelledby="pains-heading"
      className="relative isolate overflow-hidden bg-bg-dark section-padding"
    >
      {/* Релевантный bg: пыльный недостроенный объект — визуально
          подкрепляет нарратив «вот что бывает без системы». */}
      <Image
        src={BG_PHOTO}
        alt=""
        fill
        sizes="100vw"
        priority={false}
        className="-z-20 object-cover opacity-40"
      />
      {/* Тёмный overlay для читаемости текста + сплошной край сверху/снизу
         для плавного шва с соседними dark-секциями. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,6,2,1) 0%, rgba(10,6,2,0.88) 10%, rgba(10,6,2,0.78) 50%, rgba(10,6,2,0.92) 92%, rgba(10,6,2,1) 100%)',
        }}
      />

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView || reduce ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-warm-light text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2
            id="pains-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-white lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-white/70 lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Mobile: горизонтальный snap-scroll (страница короче,
            свайп удобнее чем длинная колонка). Tablet sm+: грид 2 кол.
            Desktop lg+: грид 4×2. */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className={cn(
            'mt-12 flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory',
            '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
            'sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none',
            'lg:grid-cols-4 lg:gap-5',
          )}
        >
          {PAINS.map((pain) => (
            <div
              key={pain.key}
              className="w-[280px] shrink-0 snap-start sm:w-auto"
            >
              <PainCard pain={pain} />
            </div>
          ))}
        </motion.div>

        {/* Индикатор горизонтального скролла — только мобиль */}
        <ScrollDots scrollRef={gridRef} count={PAINS.length} tone="dark" />
      </div>
    </section>
  );
}
