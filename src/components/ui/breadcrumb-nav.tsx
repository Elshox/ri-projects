'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLocale } from 'next-intl';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  const locale = useLocale();

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <li>
          <Link
            href={`/${locale}`}
            className="flex items-center transition-colors hover:text-primary"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 opacity-30" aria-hidden />
              {item.href && !isLast ? (
                <Link
                  href={`/${locale}${item.href}`}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'font-medium text-primary' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
