import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Home, MessageCircle } from 'lucide-react';

export default async function NotFound() {
  const t = await getTranslations('not_found');

  return (
    <main className="bg-bg-soft flex min-h-[80vh] items-center justify-center px-6">
      <div className="flex max-w-2xl flex-col items-center gap-6 py-24 text-center">
        {/* Большая 404 как декоративный элемент */}
        <p
          aria-hidden
          className="font-serif text-[120px] font-medium leading-none text-primary/[0.08] lg:text-[180px]"
        >
          {t('eyebrow')}
        </p>

        {/* Заголовок */}
        <h1 className="font-serif text-[36px] font-medium leading-tight text-primary lg:text-[48px]">
          {t('title')}
        </h1>

        {/* Подзаголовок */}
        <p className="max-w-md text-[16px] leading-relaxed text-muted">
          {t('subtitle')}
        </p>

        {/* CTA-кнопки */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-accent inline-flex items-center gap-2 rounded-sm px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Home className="h-4 w-4" aria-hidden />
            {t('cta_home')}
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-6 py-3 text-[14px] font-semibold text-primary transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {t('cta_contacts')}
          </Link>
        </div>
      </div>
    </main>
  );
}
