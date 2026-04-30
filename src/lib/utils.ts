import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет Tailwind-классы с разрешением конфликтов.
 * Используется во всех shadcn/ui компонентах.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Форматирует число с разделителем тысяч (RU-стиль).
 */
export function formatNumber(value: number, locale: 'ru' | 'en' = 'ru'): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US').format(value);
}

/**
 * Slug-генератор для путей (transliteration упрощённый).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}
