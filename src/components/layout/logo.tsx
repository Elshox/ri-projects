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
 *   - Квадратная рамка со СКРУГЛЁННЫМИ углами (rx=6).
 *   - Разрыв в правой стороне рамки.
 *   - Круглая точка плавает в этом разрыве — точка над «i».
 *   - Внутри рамки — крупная bold-«R».
 *
 * Итого читается как лигатура «Ri».
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
        shapeRendering="geometricPrecision"
      >
        {/*
          Рамка со скруглёнными углами + разрыв на правой стороне.
          Один path: стартуем чуть НИЖЕ разрыва (60, 30), идём против
          часовой стрелки — вниз по правой, вокруг скруглённых углов
          (через arc-команды), и обратно вверх к началу разрыва (60, 14).
          Радиус скругления — 6 (как rx="3" в исходных 28×28 ≈ ~10%).
        */}
        <path
          d="M 60 30
             L 60 54
             A 6 6 0 0 1 54 60
             L 10 60
             A 6 6 0 0 1 4 54
             L 4 10
             A 6 6 0 0 1 10 4
             L 54 4
             A 6 6 0 0 1 60 10
             L 60 14"
          stroke={fill}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/*
          Точка над «i» — заполненный круг в центре разрыва.
        */}
        <circle cx="60" cy="22" r="4.5" fill={fill} />

        {/*
          Сама буква R. Сохранена стилистика исходного маркера:
            – верхняя полупетля закрывается в ВНУТРЕННЮЮ точку талии
              (28, 32), а не в стебель — даёт характерный «вырез»
              где сходятся cross-полоска и нога;
            – нога стартует из той же внутренней точки и уходит
              вниз-вправо;
            – cross-полоска обрывается у этой точки, не пересекая
              петлю целиком.
          Stroked path вместо <text> чтобы не зависеть от загрузки
          Playfair Display и одинаково рендериться с первого кадра.
        */}
        <path
          d="M 18 50
             L 18 14
             L 36 14
             A 9 9 0 0 1 36 32
             L 28 32
             L 46 50
             M 18 32
             L 28 32"
          stroke={fill}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
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
