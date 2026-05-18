import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ogImage } from '@/lib/og';
import { PageHero } from '@/components/ui/page-hero';
import { FileText } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  const title = t('page_title');
  const description = t('page_subtitle');
  return {
    title,
    description,
    openGraph: { images: ogImage(title, description) },
    twitter: { images: ogImage(title, description).map((i) => i.url) },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  const tLegal = await getTranslations({ locale, namespace: 'legal' });

  return (
    <>
      <PageHero
        eyebrow={tLegal('breadcrumb')}
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        breadcrumbs={[
          { label: tLegal('breadcrumb') },
          { label: t('page_title') },
        ]}
      />

      <section className="py-24">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="rounded-md border border-warm/30 bg-warm/[0.05] p-6">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-warm" aria-hidden />
              <p className="text-[15px] leading-relaxed text-muted">
                {t('draft_notice')}
              </p>
            </div>
          </div>

          <p className="mt-8 text-[13px] text-muted">
            {tLegal('last_updated')}: 2026-05-18
          </p>
        </div>
      </section>
    </>
  );
}
