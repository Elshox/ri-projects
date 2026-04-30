import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Конфигурация локалей. RU — основной (по умолчанию).
 * На будущее: добавить 'uz' (см. CLAUDE.md §5.3).
 */
export const routing = defineRouting({
  locales: ['ru', 'en'] as const,
  defaultLocale: 'ru',
  // /ru/... видим в URL даже для дефолтной локали — лучше для SEO/hreflang.
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

/**
 * Type-safe навигация. Импортируй <Link> и redirect отсюда,
 * НЕ из next/link и next/navigation, чтобы локаль подставлялась автоматически.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
