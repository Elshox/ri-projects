'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import {
  Clock,
  TrendingDown,
  FileWarning,
  AlertTriangle,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  Pain points — пять болей проектной комплектации, которые мы
 *  закрываем. Размещается между Hero и Services: «agitate the
 *  problem before showing the solution» — классический
 *  premium-B2B paтерн.
 * ───────────────────────────────────────────────────────────── */

type PainKey =
  | 'delivery_slip'
  | 'budget_overrun'
  | 'customs_chaos'
  | 'quality_mismatch'
  | 'negotiation_drain';

const PAINS: { key: PainKey; Icon: LucideIcon }[] = [
  { key: 'delivery_slip', Icon: Clock },
  { key: 'budget_overrun', Icon: TrendingDown },
  { key: 'customs_chaos', Icon: FileWarning },
  { key: 'quality_mismatch', Icon: AlertTriangle },
  { key: 'negotiation_drain', Icon: Users },
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

        {/* Grid 1 → 2 → 3 columns; пятая карточка занимает одну ячейку,
            на lg ряд получается 3+2 (центральная + крайние пустоты) */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5"
        >
          {PAINS.map((pain, i) => (
            <div
              key={pain.key}
              className={cn(
                // Desktop: 6-column grid, каждая карточка = 2 колонки → 3+2
                'lg:col-span-2',
                // Карточка 4 (index 3): сдвиг на 2-ю колонку центрирует нижний ряд
                i === 3 && 'lg:col-start-2',
                // Карточка 5 (index 4) на sm = полная ширина, но max 50% по центру
                i === 4 &&
                  'sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-8px)] lg:col-span-2 lg:mx-0 lg:max-w-none',
              )}
            >
              <PainCard pain={pain} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
