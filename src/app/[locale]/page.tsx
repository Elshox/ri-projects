import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/hero-section';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />

      {/* Placeholder для секций 2–9 главной (CLAUDE.md §5.1).
          Нужен пока что только чтобы Header переходил в scrolled-state
          при скролле — реальные секции добавим следующими шагами. */}
      <section className="bg-background py-24 lg:py-32" aria-hidden>
        <div className="container mx-auto" />
      </section>
    </>
  );
}
