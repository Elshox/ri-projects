export type InsightCategory = 'ffe' | 'ose' | 'logistics' | 'trends' | 'case-study';

export type InsightMeta = {
  slug: string;
  category: InsightCategory;
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  coverImage: string;
  author: string;
};

/* Все 6 cover-фото — Unsplash CDN (whitelisted в next.config.mjs).
   Папки public/images/insights/ нет, эти URLs работают и в
   превью на главной, и на детальной странице каждой статьи. */
export const INSIGHTS: readonly InsightMeta[] = [
  {
    slug: 'hotel-ffe-guide',
    category: 'ffe',
    publishedAt: '2026-04-15',
    readingTime: 8,
    /* Отельный номер с тёплой мебелью — гид по FF&E для отельеров */
    coverImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'ose-checklist-restaurant',
    category: 'ose',
    publishedAt: '2026-03-28',
    readingTime: 6,
    /* Сервированный ресторанный стол — OS&E чек-лист */
    coverImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'logistics-cis-guide',
    category: 'logistics',
    publishedAt: '2026-03-10',
    readingTime: 10,
    /* Контейнерный порт — логистика СНГ */
    coverImage:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=80&auto=format',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'hospitality-trends-2026',
    category: 'trends',
    publishedAt: '2026-02-20',
    readingTime: 7,
    /* Современный отельный лобби — тренды дизайна 2026 */
    coverImage:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80&auto=format',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'hilton-tashkent-case',
    category: 'case-study',
    publishedAt: '2026-02-05',
    readingTime: 12,
    /* Hilton-style номер — узнаваемо, тот же визуал, что и на
       странице проекта Hilton Tashkent. */
    coverImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80&auto=format',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'certification-eaes',
    category: 'logistics',
    publishedAt: '2026-01-18',
    readingTime: 9,
    /* Документы / печати — сертификация */
    coverImage:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80&auto=format',
    author: 'Команда RI PROJECTS',
  },
] as const;

export function getInsight(slug: string): InsightMeta | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export const CATEGORY_LABELS: Record<InsightCategory, { ru: string; en: string }> = {
  ffe: { ru: 'FF&E', en: 'FF&E' },
  ose: { ru: 'OS&E', en: 'OS&E' },
  logistics: { ru: 'Логистика', en: 'Logistics' },
  trends: { ru: 'Тренды', en: 'Trends' },
  'case-study': { ru: 'Кейс', en: 'Case Study' },
};
