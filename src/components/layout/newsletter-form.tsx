'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const STATUS_MSG = {
  success: { ru: 'Вы подписаны!', en: 'Subscribed!' },
  error: { ru: 'Ошибка — попробуйте ещё раз', en: 'Error — please try again' },
} as const;

/**
 * Newsletter-форма в footer'е. Client-компонент, потому что:
 *   - есть onSubmit
 *   - локально хранит email + статус отправки
 *
 * Реальная отправка пока заглушена — будет подключена через
 * Resend API в src/app/api/newsletter/route.ts (отдельная итерация).
 */
export function NewsletterForm() {
  const t = useTranslations('footer.newsletter');
  const locale = useLocale() as 'ru' | 'en';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting' || !email) return;

    setStatus('submitting');
    try {
      // TODO: POST /api/newsletter once endpoint is wired
      await new Promise((res) => setTimeout(res, 600));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  const isDone = status === 'success';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label={t('title')}
      className="mt-8 max-w-sm"
    >
      <p className="text-sm font-medium uppercase tracking-wide text-white">{t('title')}</p>
      <p className="mt-1 text-xs text-white/60">{t('subtitle')}</p>

      <div className="mt-3 flex h-11 items-stretch gap-0 overflow-hidden rounded-sm border border-white/15 bg-white/5 transition focus-within:border-white/40">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          disabled={isDone}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/40 focus:outline-none disabled:opacity-60"
          aria-label={t('placeholder')}
        />
        <button
          type="submit"
          disabled={status === 'submitting' || isDone}
          className="bg-accent inline-flex items-center px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === 'submitting' ? '…' : isDone ? '✓' : t('submit')}
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-[16px] text-xs ${status === 'error' ? 'text-red-400' : 'text-white/60'}`}
      >
        {status === 'success' && STATUS_MSG.success[locale]}
        {status === 'error' && STATUS_MSG.error[locale]}
      </p>
    </form>
  );
}
