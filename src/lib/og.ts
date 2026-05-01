const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://riprojects.org';

export function ogImage(title: string, subtitle?: string) {
  const url = new URL('/api/og', SITE_URL);
  url.searchParams.set('title', title);
  if (subtitle) url.searchParams.set('subtitle', subtitle);
  return [{ url: url.toString(), width: 1200, height: 630, alt: title }];
}
