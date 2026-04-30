import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <>
      {/* Hero — тёмная секция, чтобы прозрачный header читался поверх */}
      <section className="bg-bg-dark relative isolate overflow-hidden text-white">
        {/* фоновый декор — мягкая радиальная подсветка тёплого цвета */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(80% 60% at 18% 35%, rgba(180,104,60,0.18) 0%, transparent 60%), radial-gradient(60% 50% at 80% 70%, rgba(0,119,200,0.10) 0%, transparent 60%)',
          }}
        />
        <div className="container mx-auto flex min-h-[88vh] flex-col items-start justify-center gap-6 pb-24 pt-32 sm:pt-40">
          <p className="text-warm text-sm font-medium uppercase tracking-[0.2em]">
            {t('eyebrow')}
          </p>
          <h1 className="font-serif text-[44px] leading-[1.05] sm:text-6xl lg:text-[80px]">
            {t('hero.title')}
          </h1>
          <p className="max-w-2xl text-base text-white/75 sm:text-lg">{t('hero.subtitle')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/contacts"
              className="bg-accent inline-flex items-center rounded-sm px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {t('hero.cta_primary')}
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center rounded-sm border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t('hero.cta_secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* placeholder для последующих секций — нужно чтобы scrolled-state header'а отрабатывал */}
      <section className="bg-background py-24">
        <div className="container mx-auto">
          <p className="text-muted text-sm">
            {/* Сюда поедут секции 2–9 главной (CLAUDE.md §5.1) */}
          </p>
        </div>
      </section>
    </>
  );
}
