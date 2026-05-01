import Image from 'next/image';
import { BreadcrumbNav, type BreadcrumbItem } from './breadcrumb-nav';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Absolute path to background image (shows dark overlay). */
  bgImage?: string;
  /** Use dark background (#1A1A1A) instead of warm beige. */
  dark?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImage,
  dark = false,
  breadcrumbs,
  children,
}: PageHeroProps) {
  const hasBg = Boolean(bgImage);
  const textLight = hasBg || dark;

  return (
    <section
      className={[
        'relative overflow-hidden pb-20 pt-32 lg:pt-40',
        hasBg ? 'text-white' : dark ? 'bg-bg-dark text-white' : 'bg-bg-soft',
      ].join(' ')}
    >
      {hasBg && bgImage && (
        <>
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-bg-dark/65" aria-hidden />
        </>
      )}

      <div className="container relative mx-auto max-w-7xl px-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <BreadcrumbNav
            items={breadcrumbs}
            className={['mb-8', textLight ? '[&_*]:text-white/60 [&_a:hover]:!text-white [&_.text-primary]:!text-white' : ''].join(' ')}
          />
        )}

        {eyebrow && (
          <p
            className={[
              'mb-4 font-sans text-sm font-semibold uppercase tracking-widest',
              textLight ? 'text-accent' : 'text-accent',
            ].join(' ')}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={[
            'max-w-3xl font-serif text-4xl leading-tight md:text-5xl lg:text-6xl',
            textLight ? 'text-white' : 'text-primary',
          ].join(' ')}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={[
              'mt-6 max-w-2xl font-sans text-lg leading-relaxed',
              textLight ? 'text-white/70' : 'text-muted',
            ].join(' ')}
          >
            {subtitle}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
