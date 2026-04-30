/**
 * RI PROJECTS — motion presets
 *
 * Источник истины: CLAUDE.md §3.4 (easing) + §4.2 (motion-пресеты).
 *
 * ВАЖНО: импорт из "motion/react" (НЕ "framer-motion").
 * Все компоненты, использующие эти пресеты, должны иметь "use client".
 *
 * Использование:
 *   import { motion } from "motion/react";
 *   import { fadeUp, stagger, scaleIn } from "@/lib/motion-presets";
 *
 *   <motion.div {...fadeUp}>...</motion.div>
 */

import type { Transition, Variants } from 'motion/react';

/* ──────────────────────────────────────────────────────────
 *  Easing curves
 * ──────────────────────────────────────────────────────────*/

export const easing = {
  /** Премиум-easing — основной для появлений и переходов. */
  smooth: [0.16, 1, 0.3, 1] as const,
  /** Быстрые UI-transitions (hover, focus). */
  snappy: [0.4, 0, 0.2, 1] as const,
  /** Spring для интерактивных перетаскиваний. */
  spring: { type: 'spring', stiffness: 100, damping: 20 } as const satisfies Transition,
} as const;

/* ──────────────────────────────────────────────────────────
 *  Длительности (s)
 * ──────────────────────────────────────────────────────────*/

export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
} as const;

/* ──────────────────────────────────────────────────────────
 *  Базовые пресеты — используются как props на <motion.*>
 * ──────────────────────────────────────────────────────────*/

/**
 * Появление снизу с fade — основной пресет для секций и карточек.
 */
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.base, ease: easing.smooth },
} as const;

/**
 * Простой fade без смещения — для оверлеев, фоновых слоёв.
 */
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: duration.base, ease: easing.smooth },
} as const;

/**
 * Scale-in с лёгким fade — для модалок, тостов, мелких UI-элементов.
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: easing.smooth },
} as const;

/**
 * Появление слева — для текстовых блоков рядом с медиа.
 */
export const slideInLeft = {
  initial: { opacity: 0, x: -32 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: duration.base, ease: easing.smooth },
} as const;

/**
 * Появление справа — зеркало slideInLeft.
 */
export const slideInRight = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: duration.base, ease: easing.smooth },
} as const;

/* ──────────────────────────────────────────────────────────
 *  Stagger — каскадные появления для списков карточек
 * ──────────────────────────────────────────────────────────*/

/**
 * Контейнер с поочередным появлением детей.
 * Используется на <motion.ul> или <motion.div> с children = motion.li/.div.
 */
export const stagger: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Дочерний элемент для использования внутри stagger-контейнера.
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easing.smooth },
  },
};

/* ──────────────────────────────────────────────────────────
 *  Hover-states — для интерактивных карточек
 * ──────────────────────────────────────────────────────────*/

/**
 * Лёгкий lift при наведении — для карточек проектов и услуг.
 */
export const cardHover = {
  whileHover: { y: -4, transition: { duration: duration.fast, ease: easing.snappy } },
  whileTap: { scale: 0.98 },
} as const;

/**
 * Магнитный эффект для CTA-кнопок.
 */
export const magneticButton = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: duration.fast, ease: easing.snappy },
} as const;

/* ──────────────────────────────────────────────────────────
 *  Viewport-настройки для useInView / whileInView
 * ──────────────────────────────────────────────────────────*/

/**
 * Стандартные параметры для scroll-reveal —
 * срабатывает один раз, когда 20% элемента в зоне видимости.
 */
export const inView = {
  once: true,
  amount: 0.2,
} as const;
