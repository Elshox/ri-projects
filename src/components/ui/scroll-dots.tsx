'use client';

import { useEffect, useState, type RefObject } from 'react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
 *  ScrollDots — индикатор горизонтальной прокрутки (точки-пагинация)
 *  для мобильных каруселей. Показывается ТОЛЬКО на мобиле (sm:hidden),
 *  т.к. на десктопе карточки лежат гридом и скролла нет.
 *
 *  Активная точка вычисляется по scrollLeft контейнера. Сигналит
 *  пользователю, что блок можно листать вбок.
 * ───────────────────────────────────────────────────────────── */
type ScrollDotsProps = {
  /** Ref на горизонтально-прокручиваемый контейнер. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Кол-во карточек = кол-во точек. */
  count: number;
  /** Тон под фон секции: dark-фон → светлые точки, и наоборот. */
  tone?: 'light' | 'dark';
  className?: string;
};

export function ScrollDots({ scrollRef, count, tone = 'dark', className }: ScrollDotsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) {
        setActive(0);
        return;
      }
      const progress = el.scrollLeft / max;
      setActive(Math.round(progress * (count - 1)));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef, count]);

  if (count <= 1) return null;

  /* Цвета точек: активная — тёплый акцент; неактивные — приглушённые
     под тон секции, но достаточно контрастные чтобы быть видимыми
     (на светлом фоне primary/20 был почти невидим). */
  const activeCls = 'bg-warm';
  const idleCls = tone === 'dark' ? 'bg-white/40' : 'bg-primary/35';

  return (
    <div
      role="presentation"
      aria-hidden
      className={cn('mt-6 flex items-center justify-center gap-2 sm:hidden', className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i === active ? `w-5 ${activeCls}` : `w-2 ${idleCls}`,
          )}
        />
      ))}
    </div>
  );
}
