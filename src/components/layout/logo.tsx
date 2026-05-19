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
        width={576}
        height={562}
        priority
        /* Полный lock-up (иконка RI + надпись «RI PROJECTS»).
           Размеры: 52 / 60 / 68 px по breakpoint'ам. В header'е
           высотой 72/96 px это даёт по 10-14 px воздуха сверху
           и снизу — лого «дышит», не упирается в края. */
        className="h-[52px] w-auto object-contain sm:h-[60px] lg:h-[68px]"
      />
    </span>
  );
}
