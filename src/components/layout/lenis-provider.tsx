'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';

/**
 * Глобальный smooth-scroll через Lenis.
 *
 * Уважает prefers-reduced-motion — отключается полностью,
 * чтобы не ломать accessibility (CLAUDE.md §4.5).
 *
 * ТАКЖЕ отключается на touch-primary устройствах (мобиле,
 * планшеты). Причины:
 *  1) Системный inertial scroll iOS/Android и так плавный —
 *     дополнительный JS-фрейм избыточен.
 *  2) Конфликт с full-screen overlay'ями третьих сторон
 *     (Bitrix24 chat widget) — Lenis продолжал двигать body
 *     пока виджет пытался лочить scroll, отсюда «белый фон»
 *     и автопрыжок к верху при открытии чата.
 */
export function LenisProvider() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    /* Тач-устройства: системный scroll лучше любого JS-smooth'а
       и не конфликтует с overlay'ями виджетов. */
    const isTouchPrimary = window.matchMedia(
      '(hover: none) and (pointer: coarse)',
    ).matches;
    if (isTouchPrimary) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Премиум-easing — соответствует easing.smooth из motion-presets
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      /* smoothTouch отключаем — теперь тач не доходит до Lenis,
         но на всякий случай 0 на случай если кто-то переключит
         media-query условие в будущем. */
      touchMultiplier: 0,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return null;
}
