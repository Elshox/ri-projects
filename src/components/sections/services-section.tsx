'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import {
  Boxes,
  Armchair,
  Package,
  Truck,
  ShieldCheck,
  ArrowRight,
  Lamp,
  Sofa,
  ShowerHead,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  Данные карточек (иконки + slug согласно CLAUDE.md §7)
 *  ffe / ose помечены `hasAlias: true` — для них рендерим plain-
 *  расшифровку и декоративные иконки в фон карточки (по фидбеку
 *  колеги 2 — FF&E/OS&E «спрятаны за аббревиатурами»).
 * ───────────────────────────────────────────────────────────── */
type ServiceSlug = 'turnkey' | 'ffe' | 'ose' | 'logistics' | 'certification';

type ServiceMeta = {
  slug: ServiceSlug;
  Icon: LucideIcon;
  hasAlias?: boolean;
  /** 2 декоративные иконки, рендерятся очень бледно в правом верхнем углу. */
  bgIcons?: readonly [LucideIcon, LucideIcon];
};

const SERVICES: readonly ServiceMeta[] = [
  { slug: 'turnkey', Icon: Boxes },
  { slug: 'ffe', Icon: Armchair, hasAlias: true, bgIcons: [Sofa, Lamp] },
  { slug: 'ose', Icon: Package, hasAlias: true, bgIcons: [ShowerHead, UtensilsCrossed] },
  { slug: 'logistics', Icon: Truck },
  { slug: 'certification', Icon: ShieldCheck },
];

/* ─────────────────────────────────────────────────────────────
 *  Motion variants — объявлены вне компонента для стабильности
 * ───────────────────────────────────────────────────────────── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easing.smooth },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.smooth },
  },
};

/* ─────────────────────────────────────────────────────────────
 *  ServiceCard
 * ───────────────────────────────────────────────────────────── */
type ServiceCardProps = ServiceMeta & {
  className?: string;
};

function ServiceCard({ slug, Icon, hasAlias, bgIcons, className }: ServiceCardProps) {
  const t = useTranslations('home.services');
  const reduce = useReducedMotion();

  return (
    <motion.article
      variants={cardVariants}
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.22, ease: easing.snappy } }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-md border border-border bg-card p-7',
        'shadow-card transition-shadow duration-300 hover:shadow-card-hover',
        className,
      )}
    >
      {/* Декоративные иконки в фоне для FF&E/OS&E — намёк на содержимое
          аббревиатуры. Очень бледные, не отвлекают от текста. */}
      {bgIcons && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 flex gap-1 text-warm/[0.07] transition-opacity duration-300 group-hover:text-warm/15"
        >
          {bgIcons.map((BgIcon, i) => (
            <BgIcon key={i} className={cn(i === 0 ? 'h-24 w-24' : 'h-16 w-16 mt-6')} strokeWidth={1.2} />
          ))}
        </div>
      )}

      {/* Иконка */}
      <span
        className={cn(
          'relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-sm',
          'bg-[#F5F1EC] text-warm transition-colors duration-300',
          'group-hover:bg-warm group-hover:text-white',
        )}
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>

      {/* H3 */}
      <h3 className="relative text-h3-m font-sans font-medium text-primary lg:text-h3-d">
        {t(`cards.${slug}.title`)}
      </h3>

      {/* Plain-расшифровка для FF&E/OS&E — чтобы клиенты вне отрасли
          сразу видели что мы поставляем (фидбек колеги 2). */}
      {hasAlias && (
        <p className="relative mt-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-warm">
          {t(`cards.${slug}.alias`)}
        </p>
      )}

      {/* Описание */}
      <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-muted">
        {t(`cards.${slug}.desc`)}
      </p>

      {/* Ссылка «Подробнее» */}
      <Link
        href={`/services/${slug}`}
        className={cn(
          'mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide',
          'text-muted transition-colors duration-200 group-hover:text-accent',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
        aria-label={`${t(`cards.${slug}.title`)} — ${t('more')}`}
      >
        {t('more')}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>

      {/* Декоративная линия снизу — появляется при hover */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 h-[2px] rounded-b-md',
          'bg-accent scale-x-0 transition-transform duration-300 origin-left',
          'group-hover:scale-x-100',
        )}
      />
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  ServicesSection
 * ───────────────────────────────────────────────────────────── */
export function ServicesSection() {
  const t = useTranslations('home.services');
  const reduce = useReducedMotion();

  /* Refs для useInView */
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-background section-padding"
    >
      <div className="container mx-auto">

        {/* ── Шапка секции ──────────────────────────────────── */}
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
            id="services-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-primary lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* ── Сетка карточек 3+2 ────────────────────────────── */}
        {/*
          Раскладка desktop (lg):
            6-колоночная сетка. Карточки 1–3: col-span-2 (auto).
            Карточка 4: col-start-2 col-span-2 → cols 2–3.
            Карточка 5: auto → cols 4–5.
            Итого: 1 и 6 колонки пустые → нижний ряд выровнен по центру.
          Раскладка tablet (sm):
            2-колонка. Карточка 5 занимает весь ряд и ограничена по ширине.
        */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-7"
        >
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.slug}
              {...service}
              className={cn(
                // Desktop: каждая карточка = 2 из 6 колонок
                'lg:col-span-2',
                // Карточка 4 (index 3): сдвиг на 2-ю колонку → центрирование нижнего ряда
                i === 3 && 'lg:col-start-2',
                // Карточка 5 (index 4): на sm — полная ширина, но max 50% и по центру
                i === 4 && 'sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-12px)] lg:col-span-2 lg:mx-0 lg:max-w-none',
              )}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
