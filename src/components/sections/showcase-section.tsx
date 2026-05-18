'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  type Variants,
} from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* Релевантный фон секции — приглушённая галерейная сцена.
   Тёмная база заставляет фото проектов в карточках работать
   максимально ярко (white-on-dark contrast). */
const BG_PHOTO =
  'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=2400&q=80&auto=format';

import { PROJECTS } from '@/lib/data/projects';

/* ── Types ── */
type Project = {
  slug: string;
  title: string;
  sector: string;
  sqm: string;
  year: string;
  lead: string;
  image: string;
};

/* Slug → отображаемое имя проекта в карточке Showcase.
   Source-of-truth для slug-ов и heroImage = src/lib/data/projects.ts —
   так клик по карточке всегда ведёт на работающую страницу
   /projects/[slug], без 404. */
const PROJECT_DISPLAY: Record<
  string,
  {
    title: { ru: string; en: string };
    sector: { ru: string; en: string };
    lead?: { ru: string; en: string };
  }
> = {
  'hilton-tashkent': {
    title: { ru: 'Hilton Tashkent', en: 'Hilton Tashkent' },
    sector: { ru: 'Отели', en: 'Hotels' },
    lead: {
      ru: '5★ отель Hilton в центре Ташкента — FF&E и OS&E на 256 номеров, банкетный зал, 3 ресторана.',
      en: '5★ Hilton in downtown Tashkent — FF&E and OS&E for 256 rooms, a ballroom and 3 restaurants.',
    },
  },
  'radisson-samarkand': {
    title: { ru: 'Radisson Samarkand', en: 'Radisson Samarkand' },
    sector: { ru: 'Отели', en: 'Hotels' },
    lead: {
      ru: 'Бутик-отель Radisson в Самарканде — комплектация номерного фонда и общественных зон.',
      en: 'Boutique Radisson in Samarkand — full FF&E for guest rooms and public areas.',
    },
  },
  'hyatt-regency': {
    title: { ru: 'Hyatt Regency Tashkent', en: 'Hyatt Regency Tashkent' },
    sector: { ru: 'Отели', en: 'Hotels' },
    lead: {
      ru: 'Премиальный комплекс Hyatt — мебель, освещение и операционное оснащение по стандартам сети.',
      en: 'Premium Hyatt property — furniture, lighting and operational kit to brand standard.',
    },
  },
  'marriott-almaty': {
    title: { ru: 'Marriott Almaty', en: 'Marriott Almaty' },
    sector: { ru: 'Отели', en: 'Hotels' },
  },
  'business-center-tashkent': {
    title: { ru: 'IT Park Tashkent', en: 'IT Park Tashkent' },
    sector: { ru: 'Бизнес-центры', en: 'Business centres' },
  },
  'residential-tashkent-city': {
    title: { ru: 'Tashkent City Residences', en: 'Tashkent City Residences' },
    sector: { ru: 'Жилые комплексы', en: 'Residential' },
  },
  'clinic-tashkent': {
    title: { ru: 'MedPlus Clinic', en: 'MedPlus Clinic' },
    sector: { ru: 'Медицина', en: 'Healthcare' },
  },
  'international-school-tashkent': {
    title: { ru: 'TIS Tashkent', en: 'TIS Tashkent' },
    sector: { ru: 'Образование', en: 'Education' },
  },
};

function formatArea(m2: number, locale: 'ru' | 'en') {
  const n = m2.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');
  return `${n} ${locale === 'ru' ? 'м²' : 'm²'}`;
}

function buildProject(slug: string, locale: 'ru' | 'en'): Project | null {
  const data = PROJECTS.find((p) => p.slug === slug);
  const display = PROJECT_DISPLAY[slug];
  if (!data || !display) return null;
  return {
    slug: data.slug,
    title: display.title[locale],
    sector: display.sector[locale],
    sqm: formatArea(data.area, locale),
    year: String(data.year),
    lead: display.lead?.[locale] ?? '',
    image: data.heroImage ?? '',
  };
}

/* Showcase layout: 1 main + 2 sides + 4 belt-slides.
   Использует первые 7 slug-ов из data/projects.ts (8-й «international-
   school-tashkent» опускаем — на главной всё равно покажется в /projects). */
function useProjects(): { featured: Project[]; belt: Project[] } {
  const locale = useLocale() as 'ru' | 'en';

  const order = [
    'hilton-tashkent',           // main — флагман
    'radisson-samarkand',        // side
    'hyatt-regency',             // side
    'marriott-almaty',           // belt
    'business-center-tashkent',  // belt
    'residential-tashkent-city', // belt
    'clinic-tashkent',           // belt
  ] as const;

  const all = order
    .map((s) => buildProject(s, locale))
    .filter((p): p is Project => p !== null);

  return {
    featured: all.slice(0, 3),
    belt: all.slice(3),
  };
}

/* ── blurDataURL — shared dark 1×1 JPEG ── */
const BLUR_DATA =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/APUKKKACiiig/9k=';

/* ── Motion variants ── */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

const mainCardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: easing.smooth } },
};

const sideCardVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easing.smooth } },
};

const beltVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const beltItemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easing.smooth } },
};

/* ── CustomCursor ─────────────────────────────────────────────
 *  Follows the mouse with a spring-smoothed position.
 *  Fixed-position so it floats over the entire viewport.
 * ── */
type CustomCursorProps = {
  label: string;
  visible: boolean;
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
};

function CustomCursor({ label, visible, x, y }: CustomCursorProps) {
  const reduce = useReducedMotion();

  const springX = useSpring(x, { stiffness: 400, damping: 35 });
  const springY = useSpring(y, { stiffness: 400, damping: 35 });

  if (reduce) return null;

  return (
    /* Outer div tracks spring-smoothed position */
    <motion.div
      style={{ position: 'fixed', top: 0, left: 0, x: springX, y: springY, zIndex: 9999 }}
      className="pointer-events-none"
      aria-hidden
    >
      {/* Inner circle — centred on the tracking point */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ duration: 0.18, ease: easing.snappy }}
        className={cn(
          '-translate-x-1/2 -translate-y-1/2',
          'flex h-[96px] w-[96px] items-center justify-center rounded-full',
          'bg-accent text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white',
        )}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

/* ── ProjectCard ── */
type ProjectCardProps = {
  project: Project;
  variants: Variants;
  viewLabel: string;
  onEnter: () => void;
  onLeave: () => void;
  sizes: string;
  priority?: boolean;
  className?: string;
};

function ProjectCard({
  project,
  variants,
  viewLabel,
  onEnter,
  onLeave,
  sizes,
  priority = false,
  className,
}: ProjectCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      variants={variants}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn('group relative overflow-hidden rounded-md', className)}
    >
      {/* Photo */}
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA}
        className={cn(
          'object-cover',
          !reduce && 'transition-transform duration-700 group-hover:scale-[1.04]',
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
      />

      {/* Permanent bottom gradient — always visible for text legibility */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5"
      />

      {/* Hover tint overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
      />

      {/* CTA pill — TOUCH/keyboard ONLY fallback.
         На устройствах с hover (мышь / трекпад) показывается
         плавающий cursor-label «СМОТРЕТЬ» — pill там визуально
         конфликтовал с курсором. CSS-фильтр `(hover: none)`
         оставляет pill только на тач-устройствах. */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          '[@media(hover:hover)]:hidden',
        )}
      >
        <span
          className={cn(
            'flex items-center gap-2 rounded-sm',
            'border border-white/50 bg-black/20 px-5 py-2.5 backdrop-blur-sm',
            'text-[12px] font-semibold uppercase tracking-[0.14em] text-white',
          )}
        >
          {viewLabel}
          <ArrowRight className="h-3 w-3" aria-hidden />
        </span>
      </div>

      {/* Card text content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 lg:p-7">
        {/* Sector badge */}
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
          {project.sector}
        </p>

        {/* Title */}
        <h3 className="font-serif text-[20px] font-medium leading-snug text-white lg:text-[24px]">
          {project.title}
        </h3>

        {/* Meta — sqm + year */}
        <div className="mt-2 flex items-center gap-2.5 text-[13px] text-white/55">
          <span>{project.sqm}</span>
          <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-white/40" />
          <span>{project.year}</span>
        </div>

        {/* Lead — slides up on hover, hidden on belt cards with no lead */}
        {project.lead && (
          <p
            className={cn(
              'mt-3 line-clamp-2 text-[14px] leading-relaxed text-white/70',
              !reduce && 'translate-y-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100',
            )}
          >
            {project.lead}
          </p>
        )}
      </div>

      {/* Full-card accessible link */}
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 rounded-md focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0"
        aria-label={`${project.title} — ${viewLabel}`}
      />
    </motion.article>
  );
}

/* ── ShowcaseSection ── */
export function ShowcaseSection() {
  const t = useTranslations('home.showcase');
  const reduce = useReducedMotion();
  const { featured, belt } = useProjects();

  /* Custom cursor state */
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY],
  );

  const showCursor = useCallback(() => setCursorVisible(true), []);
  const hideCursor = useCallback(() => setCursorVisible(false), []);

  /* InView refs */
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });
  const beltInView = useInView(beltRef, { once: true, amount: 0.15 });

  const [main, ...sides] = featured;

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="relative isolate overflow-hidden bg-bg-dark section-padding"
      onMouseMove={handleMouseMove}
    >
      {/* Тёмный фон-галерея — заставляет проектные карточки светиться. */}
      <Image
        src={BG_PHOTO}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,6,2,0.82) 0%, rgba(10,6,2,0.92) 100%)',
        }}
      />
      {/* Custom cursor — rendered at document root level via fixed position */}
      <CustomCursor
        label={t('cursor_label')}
        visible={cursorVisible}
        x={cursorX}
        y={cursorY}
      />

      <div className="container mx-auto">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, ease: easing.smooth }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-warm-light text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2
            id="showcase-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-white lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-white/70 lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* ── Featured editorial grid ──
          Desktop (lg): left = main card 2/3, right = two side cards 1/3
          Grid: 3 cols, 2 auto-rows of 290px = main spans both rows (580px)
        ── */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView || reduce ? 'visible' : 'hidden'}
          variants={gridVariants}
          className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-[290px] lg:gap-5"
        >
          {/* Main card — 2/3 + full height */}
          {main && (
            <ProjectCard
              project={main}
              variants={mainCardVariants}
              viewLabel={t('view_case')}
              onEnter={showCursor}
              onLeave={hideCursor}
              sizes="(max-width: 1024px) 100vw, 67vw"
              priority
              className="aspect-[4/5] lg:aspect-auto lg:col-span-2 lg:row-span-2"
            />
          )}

          {/* Side cards — each 1/3 width, 290px */}
          {sides.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              variants={sideCardVariants}
              viewLabel={t('view_case')}
              onEnter={showCursor}
              onLeave={hideCursor}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="aspect-[4/5] lg:aspect-auto"
            />
          ))}
        </motion.div>

        {/* ── Snap-scroll belt ── */}
        <motion.div
          ref={beltRef}
          initial="hidden"
          animate={beltInView || reduce ? 'visible' : 'hidden'}
          variants={beltVariants}
          className={cn(
            'mt-5 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8',
            /* Hide scrollbar cross-browser */
            '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
          )}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex gap-4 px-4 pb-2 sm:px-6 lg:gap-5 lg:px-8">
            {belt.map((project) => (
              <motion.div
                key={project.slug}
                variants={beltItemVariants}
                className="w-[280px] flex-shrink-0 sm:w-[320px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProjectCard
                  project={project}
                  variants={beltItemVariants}
                  viewLabel={t('view_case')}
                  onEnter={showCursor}
                  onLeave={hideCursor}
                  sizes="20rem"
                  className="aspect-[3/4]"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── All projects CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={beltInView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: easing.smooth, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            href="/projects"
            className={cn(
              'group inline-flex items-center gap-2',
              'text-[15px] font-semibold text-white',
              'transition-colors duration-200 hover:text-warm-light',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
            )}
          >
            {t('view_all')}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
