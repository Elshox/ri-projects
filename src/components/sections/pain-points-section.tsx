'use client';

import { useRef } from 'react';
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
        'group relative flex flex-col gap-4 rounded-md border border-border bg-card p-6',
        'transition-colors duration-300 hover:border-warm/40',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm',
          'bg-warm/10 text-warm transition-colors duration-300',
          'group-hover:bg-warm group-hover:text-white',
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>

      <div>
        <h3 className="text-[16px] font-medium leading-snug text-primary lg:text-[17px]">
          {t(`${key}.title`)}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted lg:text-[15px]">
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
      className="bg-bg-soft section-padding"
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
            id="pains-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-primary lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid 1 → 2 → 4 columns. Восемь карточек идеально ложатся
            в 4×2 на desktop, 2×4 на tablet и 1×8 на mobile. */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {PAINS.map((pain) => (
            <PainCard key={pain.key} pain={pain} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
