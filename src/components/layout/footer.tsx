import { useTranslations } from 'next-intl';
import { Linkedin, Send, Instagram, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Logo } from './logo';
import { NewsletterForm } from './newsletter-form';
import { FOOTER_COLUMNS, SOCIAL_LINKS } from '@/lib/nav-config';
import { cn } from '@/lib/utils';

const SOCIAL_ICONS: Record<(typeof SOCIAL_LINKS)[number]['key'], typeof Linkedin> = {
  linkedin: Linkedin,
  telegram: Send,
  instagram: Instagram,
};

/**
 * Глобальный footer. 5 колонок по сетке (CLAUDE.md §5.1, экран 10).
 * На мобильных — стек 1 колонки.
 *
 * Структура колонок:
 *   1. Бренд (logo + tagline + newsletter)
 *   2. Услуги
 *   3. Сегменты
 *   4. Компания
 *   5. Контакты + соцсети
 *
 * Bottom-bar: copyright + privacy + terms + cookies.
 */
export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark mt-auto text-white/80">
      <div className="container mx-auto py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* ── Колонка 1 (бренд) — занимает 4 / 12 на десктопе ───── */}
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              {t('footer.tagline')}
            </p>

            <NewsletterForm />
          </div>

          {/* ── Колонки 2–4 (списки ссылок) — 6 / 12 десктоп ──────── */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-5">
            {FOOTER_COLUMNS.map((col) => (
              <FooterLinkColumn key={col.id} column={col} />
            ))}
          </div>

          {/* ── Колонка 5 (контакты) — 3 / 12 ──────────────────────── */}
          <div className="lg:col-span-3">
            <p className="text-sm font-medium uppercase tracking-wide text-white">
              {t('footer.columns.contacts.title')}
            </p>
            <ul className="mt-5 space-y-4 text-sm">
              <ContactItem
                icon={MapPin}
                label={t('footer.columns.contacts.address_label')}
                value={t('footer.columns.contacts.address')}
              />
              <ContactItem
                icon={Phone}
                label={t('footer.columns.contacts.phone_label')}
                value={t('footer.columns.contacts.phone')}
                href={`tel:${t('footer.columns.contacts.phone').replace(/[^\d+]/g, '')}`}
              />
              <ContactItem
                icon={Mail}
                label={t('footer.columns.contacts.email_label')}
                value={t('footer.columns.contacts.email')}
                href={`mailto:${t('footer.columns.contacts.email')}`}
              />
              <ContactItem
                icon={Clock}
                label={t('footer.columns.contacts.hours_label')}
                value={t('footer.columns.contacts.hours')}
              />
            </ul>

            <div className="mt-6">
              <p className="sr-only">{t('footer.social.title')}</p>
              <ul className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ key, href }) => {
                  const Icon = SOCIAL_ICONS[key];
                  return (
                    <li key={key}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t(`footer.social.${key}`)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 text-white/70 transition hover:bg-white hover:text-bg-dark focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.bottom.rights', { year })}</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link
                href="/legal/privacy"
                className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                {t('footer.bottom.privacy')}
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                {t('footer.bottom.terms')}
              </Link>
            </li>
            <li>
              <Link
                href="/legal/cookies"
                className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                {t('footer.bottom.cookies')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ── helpers ─────────────────────────────────────────────── */

function FooterLinkColumn({ column }: { column: (typeof FOOTER_COLUMNS)[number] }) {
  const t = useTranslations();
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-white">
        {t(`footer.columns.${column.id}.title`)}
      </p>
      <ul className="mt-5 space-y-3 text-sm">
        {column.links.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className={cn(
                'text-white/70 transition-colors hover:text-white',
                'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
              )}
            >
              {t(`footer.columns.${column.id}.links.${link.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ContactItemProps = {
  icon: typeof Linkedin;
  label: string;
  value: string;
  href?: string;
};

function ContactItem({ icon: Icon, label, value, href }: ContactItemProps) {
  const content = (
    <span className="inline-flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-white/50">{label}</span>
      <span className="text-white/85 mt-0.5">{value}</span>
    </span>
  );
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden />
      {href ? (
        <a
          href={href}
          className="hover:text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}
