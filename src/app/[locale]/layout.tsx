import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LenisProvider } from '@/components/layout/lenis-provider';
import { JsonLd } from '@/components/layout/json-ld';
import { BitrixChatWidget } from '@/components/integrations/bitrix-chat';
import '../globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://riprojects.org';

const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const serif = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

type Params = { locale: string };

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A1A',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const ogImageUrl = `/api/og?title=${encodeURIComponent(t('title').replace(' | RI PROJECTS', ''))}&locale=${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: `%s | RI PROJECTS` },
    description: t('description'),
    keywords: ['FF&E', 'OS&E', 'комплектация', 'отель', 'ресторан', 'мебель', 'Ташкент', 'СНГ', 'поставка'],

    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ru: `${SITE_URL}/ru`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/ru`,
      },
    },

    openGraph: {
      type: 'website',
      siteName: 'RI PROJECTS',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: locale === 'ru' ? ['en_US'] : ['ru_RU'],
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: t('title') }],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@riprojects',
      title: t('title'),
      description: t('description'),
      images: [ogImageUrl],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<Params>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'header' });

  return (
    <html lang={locale} className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* Skip-to-content — первый элемент фокуса, скрыт до Tab */}
          <a
            href="#main"
            className="fixed left-4 top-4 z-[9999] -translate-y-20 rounded-md bg-accent px-4 py-2 font-sans text-sm font-semibold text-white opacity-0 shadow-card-hover transition-[transform,opacity] duration-200 focus:translate-y-0 focus:opacity-100"
          >
            {t('skip_to_content')}
          </a>

          <LenisProvider />
          <Header />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <BitrixChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
