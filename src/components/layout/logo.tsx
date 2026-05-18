import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  variant?: 'dark' | 'light';
  ariaLabel?: string;
};

/**
 * Wordmark-логотип RI PROJECTS.
 * Делает 1:1 на любом фоне за счёт CSS-переменной --color-primary
 * и пропа variant для светлых поверхностей.
 */
export function Logo({ className, variant = 'dark', ariaLabel = 'RI PROJECTS' }: LogoProps) {
  const fill = variant === 'light' ? '#FFFFFF' : 'var(--color-primary)';
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-2 font-serif leading-none', className)}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M 4 1 L 24 1 A 3 3 0 0 1 27 4 M 27 13 L 27 24 A 3 3 0 0 1 24 27 L 4 27 A 3 3 0 0 1 1 24 L 1 4 A 3 3 0 0 1 4 1"
          stroke={fill}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M8 8h7a4 4 0 0 1 0 8h-3l5 4M8 8v12M8 16h4"
          stroke={fill}
          strokeWidth="1.6"
          strokeLinecap="square"
          fill="none"
        />
        <circle cx="27" cy="9" r="2.5" fill={fill} />
      </svg>
      <span
        style={{ color: fill }}
        className="text-[20px] font-medium tracking-[0.16em] lg:text-[21px]"
      >
        RI PROJECTS
      </span>
    </span>
  );
}
