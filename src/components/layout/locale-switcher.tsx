'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type LocaleSwitcherProps = {
  /**
   * Контекст рендера. На светлом header'е используем dark-стиль, на тёмном hero — light.
   */
  variant?: 'dark' | 'light';
  className?: string;
};

const LOCALES: readonly Locale[] = ['ru', 'en'] as const;

/**
 * Переключатель локалей RU / EN. Сохраняет текущий path, меняя только префикс локали.
 * Использует startTransition чтобы UI не блокировался во время навигации.
 */
export function LocaleSwitcher({ variant = 'dark', className }: LocaleSwitcherProps) {
  const t = useTranslations('locale');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (next: Locale) => {
    if (next === locale || isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  const baseColor =
    variant === 'light' ? 'text-white/70 hover:text-white' : 'text-muted hover:text-primary';
  const activeColor = variant === 'light' ? 'text-white' : 'text-primary';
  const dividerColor = variant === 'light' ? 'bg-white/30' : 'bg-border';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 text-[13px] font-medium tracking-wide',
        className,
      )}
      role="group"
      aria-label={t('switch_to_en')}
    >
      {LOCALES.map((code, idx) => {
        const isActive = code === locale;
        return (
          <span key={code} className="inline-flex items-center">
            {idx > 0 && <span className={cn('mx-1 h-3 w-px', dividerColor)} aria-hidden />}
            <button
              type="button"
              onClick={() => handleSelect(code)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={code === 'ru' ? t('switch_to_ru') : t('switch_to_en')}
              className={cn(
                'rounded-sm px-1 py-0.5 uppercase transition-colors duration-200 ease-snappy',
                isActive ? activeColor : baseColor,
                'focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              {t(code)}
            </button>
          </span>
        );
      })}
    </div>
  );
}
