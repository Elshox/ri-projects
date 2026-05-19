import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  /** dark → лого для светлых поверхностей; light → лого для тёмного фона. */
  variant?: 'dark' | 'light';
  ariaLabel?: string;
};

/* ─────────────────────────────────────────────────────────────
 *  RI PROJECTS — фирменный lockup-логотип.
 *  Использует две версии (logo-dark.png и logo-light.png),
 *  отдаваемые из public/images/brand/. Файлы — вертикальный
 *  lockup 1024×1536 (RI-иконка + надпись «RI PROJECTS» под ней).
 *  width/height в next/image нужны для сохранения aspect-ratio;
 *  визуальный размер задаётся через h-* классы (w-auto).
 * ───────────────────────────────────────────────────────────── */
export function Logo({ className, variant = 'dark', ariaLabel = 'RI PROJECTS' }: LogoProps) {
  const src =
    variant === 'light'
      ? '/images/brand/logo-light.png'
      : '/images/brand/logo-dark.png';

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src={src}
        alt={ariaLabel}
        width={1024}
        height={1536}
        priority
        /* Visual height ladder: 48px → 56px → 64px (mobile → sm → lg).
           w-auto сохраняет 2:3 пропорции lock-up'а. object-contain
           гарантирует что ничего не обрезается при нестандартных
           родительских контейнерах. */
        className="h-12 w-auto object-contain sm:h-14 lg:h-16"
      />
    </span>
  );
}
