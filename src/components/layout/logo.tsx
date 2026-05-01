import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  variant?: 'dark' | 'light';
  ariaLabel?: string;
  /** Размер иконки в px (масштабирует viewBox 64×64). По умолчанию 32. */
  size?: number;
  /** Если true — рендерим только маркер без wordmark-текста. */
  iconOnly?: boolean;
};

/**
 * Wordmark + иконка RI PROJECTS.
 *
 * Композиция иконки:
 *   - Квадратная рамка с разрывом в правой верхней части.
 *   - Круглая точка плавает в этом разрыве — визуально это точка над «i».
 *   - Правая сторона рамки играет роль вертикального стебля «i».
 *   - Внутри рамки — крупная bold-«R».
 * Итого читается как лигатура «Ri» (= RI PROJECTS).
 */
export function Logo({
  className,
  variant = 'dark',
  ariaLabel = 'RI PROJECTS',
  size = 32,
  iconOnly = false,
}: LogoProps) {
  const fill = variant === 'light' ? '#FFFFFF' : 'var(--color-primary)';

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-2.5 font-serif leading-none', className)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        // Точные пиксельные хинты — иначе на ретине тонкие линии плывут.
        shapeRendering="geometricPrecision"
      >
        {/*
          Квадратная рамка с разрывом на правой стороне.
          Рисуется одним path'ом против часовой стрелки от точки чуть ниже
          разрыва: вниз по правой стороне, потом низ, левая, верхняя стороны
          и обратно вправо до начала разрыва. Углы — sharp (miter).
        */}
        <path
          d="M 60 30
             L 60 60
             L 4  60
             L 4  4
             L 60 4
             L 60 14"
          stroke={fill}
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/*
          Точка над «i» — заполненный круг в центре разрыва.
          Радиус 4.5 совпадает по толщине с ходом самой рамки.
        */}
        <circle cx="60" cy="22" r="4.5" fill={fill} />

        {/*
          Сама буква R. Рисуем path'ом (а не <text>) чтобы не зависеть от
          доступности Playfair Display и одинаково рендерилось до font-swap.
          Стиль: heavy bold, оптически центрирован в рамке.
        */}
        <path
          d="M 18 50
             L 18 14
             L 36 14
             A 9 9 0 0 1 36 32
             L 18 32
             M 31 32
             L 46 50"
          stroke={fill}
          strokeWidth="4.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
      </svg>

      {!iconOnly && (
        <span
          style={{ color: fill }}
          className="text-[18px] font-medium tracking-[0.18em]"
        >
          RI PROJECTS
        </span>
      )}
    </span>
  );
}
