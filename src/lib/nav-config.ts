/**
 * Источник истины по навигации.
 * Все секции/услуги/сегменты идут отсюда — header.tsx, footer.tsx,
 * sitemap.xml, breadcrumbs читают этот файл.
 *
 * Структура согласована с CLAUDE.md §5.2 + §6 + §7.
 */

export type NavItem = {
  /** Slug для t() в namespace 'nav' */
  key: 'services' | 'sectors' | 'projects' | 'about' | 'insights' | 'contacts';
  /** Путь без префикса локали */
  href: string;
};

export const PRIMARY_NAV: readonly NavItem[] = [
  { key: 'services', href: '/services' },
  { key: 'sectors', href: '/sectors' },
  { key: 'projects', href: '/projects' },
  { key: 'about', href: '/about' },
  { key: 'insights', href: '/insights' },
  { key: 'contacts', href: '/contacts' },
] as const;

/* ── Footer-колонки ──────────────────────────────────────── */

export type FooterLinkKey = string;

export type FooterColumn = {
  /** namespace + key для заголовка: footer.columns.<id>.title */
  id: 'services' | 'sectors' | 'company';
  links: { key: FooterLinkKey; href: string }[];
};

export const FOOTER_SERVICES: FooterColumn = {
  id: 'services',
  links: [
    { key: 'turnkey', href: '/services/turnkey' },
    { key: 'ffe', href: '/services/ffe' },
    { key: 'ose', href: '/services/ose' },
    { key: 'logistics', href: '/services/logistics' },
    { key: 'certification', href: '/services/certification' },
  ],
};

export const FOOTER_SECTORS: FooterColumn = {
  id: 'sectors',
  links: [
    { key: 'hotels', href: '/sectors/hotels' },
    { key: 'restaurants', href: '/sectors/restaurants' },
    { key: 'residential', href: '/sectors/residential' },
    { key: 'business_centers', href: '/sectors/business-centers' },
    { key: 'medical', href: '/sectors/medical' },
    { key: 'education', href: '/sectors/education' },
    { key: 'retail', href: '/sectors/retail' },
    { key: 'banks', href: '/sectors/banks' },
  ],
};

export const FOOTER_COMPANY: FooterColumn = {
  id: 'company',
  links: [
    { key: 'about', href: '/about' },
    { key: 'production', href: '/about/production' },
    { key: 'partners', href: '/about/partners' },
    { key: 'projects', href: '/projects' },
    { key: 'insights', href: '/insights' },
  ],
};

export const FOOTER_COLUMNS = [FOOTER_SERVICES, FOOTER_SECTORS, FOOTER_COMPANY] as const;

/* ── Соцсети ─────────────────────────────────────────────── */

export const SOCIAL_LINKS = [
  { key: 'linkedin' as const, href: 'https://www.linkedin.com/company/riprojects' },
  { key: 'telegram' as const, href: 'https://t.me/riprojects' },
  { key: 'instagram' as const, href: 'https://www.instagram.com/riprojects' },
] as const;
