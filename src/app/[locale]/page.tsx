import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/hero-section';
import { ServicesSection } from '@/components/sections/services-section';

/* Below-fold sections — code-split to reduce initial JS payload */
const SectorsGrid = dynamic(() =>
  import('@/components/sections/sectors-grid').then((m) => m.SectorsGrid),
);
const StatsSection = dynamic(() =>
  import('@/components/sections/stats-section').then((m) => m.StatsSection),
);
const ShowcaseSection = dynamic(() =>
  import('@/components/sections/showcase-section').then((m) => m.ShowcaseSection),
);
const PartnersMarquee = dynamic(() =>
  import('@/components/sections/partners-marquee').then((m) => m.PartnersMarquee),
);
const ProcessTimeline = dynamic(() =>
  import('@/components/sections/process-timeline').then((m) => m.ProcessTimeline),
);
const InsightsPreview = dynamic(() =>
  import('@/components/sections/insights-preview').then((m) => m.InsightsPreview),
);
const ContactSection = dynamic(() =>
  import('@/components/sections/contact-section').then((m) => m.ContactSection),
);

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <SectorsGrid />
      <StatsSection />
      <ShowcaseSection />
      <PartnersMarquee />
      <ProcessTimeline />
      <InsightsPreview />
      <ContactSection />
    </>
  );
}
