/** @type {import('next-sitemap').IConfig} */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://riprojects.org';

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,

  // Exclude API routes and the duplicate RU locale tree.
  // The EN locale (/en/*) is canonical; hreflang for RU is emitted in <head> via generateMetadata.
  exclude: ['/api/*', '/ru/*'],

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/_next/'] },
    ],
  },

  transform: async (config, path) => {
    const highPriority = [
      '/en',
      '/en/services',
      '/en/sectors',
      '/en/projects',
      '/en/about',
      '/en/contacts',
    ];

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: highPriority.includes(path) ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
      // Hreflang alternates are emitted in <head> via generateMetadata — no need to duplicate in sitemap.
    };
  },
};
