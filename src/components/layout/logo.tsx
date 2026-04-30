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
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="1" y="1" width="26" height="26" rx="3" stroke={fill} strokeWidth="1.5" />
        <path
          d="M8 8h7a4 4 0 0 1 0 8h-3l5 4M8 8v12M8 16h4"
          stroke={fill}
          strokeWidth="1.6"
          strokeLinecap="square"
          fill="none"
        />
      </svg>
      <span
        style={{ color: fill }}
        className="text-[18px] font-medium tracking-[0.18em]"
      >
        RI PROJECTS
      </span>
    </span>
  );
}
