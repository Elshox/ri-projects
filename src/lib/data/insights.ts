export type InsightCategory = 'ffe' | 'ose' | 'logistics' | 'trends' | 'case-study';

export type InsightMeta = {
  slug: string;
  category: InsightCategory;
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  coverImage: string;
  author: string;
};

export const INSIGHTS: readonly InsightMeta[] = [
  {
    slug: 'hotel-ffe-guide',
    category: 'ffe',
    publishedAt: '2026-04-15',
    readingTime: 8,
    coverImage: '/images/insights/hotel-ffe-guide.jpg',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'ose-checklist-restaurant',
    category: 'ose',
    publishedAt: '2026-03-28',
    readingTime: 6,
    coverImage: '/images/insights/ose-checklist.jpg',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'logistics-cis-guide',
    category: 'logistics',
    publishedAt: '2026-03-10',
    readingTime: 10,
    coverImage: '/images/insights/logistics-cis.jpg',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'hospitality-trends-2026',
    category: 'trends',
    publishedAt: '2026-02-20',
    readingTime: 7,
    coverImage: '/images/insights/trends-2026.jpg',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'hilton-tashkent-case',
    category: 'case-study',
    publishedAt: '2026-02-05',
    readingTime: 12,
    coverImage: '/images/insights/hilton-case.jpg',
    author: 'Команда RI PROJECTS',
  },
  {
    slug: 'certification-eaes',
    category: 'logistics',
    publishedAt: '2026-01-18',
    readingTime: 9,
    coverImage: '/images/insights/certification.jpg',
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
