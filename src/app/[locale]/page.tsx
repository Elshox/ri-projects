import { setRequestLocale, getTranslations } from 'next-intl/server';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <main className="min-h-screen">
      <section className="container mx-auto flex min-h-[80vh] flex-col items-start justify-center gap-6 px-6 py-24 lg:px-12">
        <p className="text-warm font-sans text-sm font-medium uppercase tracking-widest">
          {t('eyebrow')}
        </p>
        <h1 className="font-serif text-[44px] leading-[1.05] text-primary sm:text-6xl lg:text-[80px]">
          {t('hero.title')}
        </h1>
        <p className="text-muted max-w-2xl font-sans text-base sm:text-lg">{t('hero.subtitle')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`/${locale}/contacts`}
            className="bg-accent inline-flex items-center rounded-sm px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t('hero.cta_primary')}
          </a>
          <a
            href={`/${locale}/projects`}
            className="border-border text-primary inline-flex items-center rounded-sm border px-6 py-3 text-sm font-semibold transition hover:bg-bg-soft"
          >
            {t('hero.cta_secondary')}
          </a>
        </div>
      </section>
    </main>
  );
}
