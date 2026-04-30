import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function NotFound() {
  const t = await getTranslations('home');
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-warm text-sm uppercase tracking-widest">404</p>
        <h1 className="font-serif text-h1-m lg:text-h1-d">{t('eyebrow')}</h1>
        <Link
          href="/"
          className="bg-accent mt-4 inline-flex items-center rounded-sm px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          ←
        </Link>
      </div>
    </main>
  );
}
