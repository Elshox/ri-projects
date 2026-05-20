import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  /* Standalone-бандл только когда явно просим (BUILD_STANDALONE=true) —
     для деплоя на Node-хостинг (cPanel). Netlify собирает без этого env
     и пользуется своим @netlify/plugin-nextjs, поэтому конфликта нет. */
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      /* elitoffice.com — наш партнёр-поставщик, разрешил использовать
         фото реализованных hospitality-проектов (отели, рестораны). */
      { protocol: 'https', hostname: 'elitoffice.com' },
    ],
  },
  async headers() {
    /* Content-Security-Policy — разрешаем только наши известные
       внешние источники. Bitrix24 (форма + чат), Google Maps/Fonts,
       Unsplash/Cloudinary/elitoffice (картинки), idcomplect (видео).
       'unsafe-inline' в script/style неизбежен: Next.js и styled-jsx
       инжектят инлайн-стили, Bitrix — инлайн-скрипты. img-src https:
       широкий т.к. CDN несколько и Bitrix тянет картинки отовсюду. */
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn-ru.bitrix24.kz https://*.bitrix24.kz https://*.bitrix24.com https://www.google.com https://maps.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn-ru.bitrix24.kz https://*.bitrix24.kz",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com https://cdn-ru.bitrix24.kz https://*.bitrix24.kz",
      "media-src 'self' https://idcomplect.ru",
      "connect-src 'self' https://cdn-ru.bitrix24.kz https://*.bitrix24.kz https://*.bitrix24.com wss://*.bitrix24.kz wss://*.bitrix24.com",
      "frame-src 'self' https://cdn-ru.bitrix24.kz https://*.bitrix24.kz https://*.bitrix24.com https://www.google.com https://maps.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.bitrix24.kz https://*.bitrix24.com",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          /* HSTS — форсим HTTPS у браузера на 1 год + поддомены. */
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
