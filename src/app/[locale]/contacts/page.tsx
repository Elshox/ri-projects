import type { Metadata } from 'next';
import { ogImage } from '@/lib/og';
import type { LucideIcon } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { ContactSection } from '@/components/sections/contact-section';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contacts' });
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

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contacts' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  const address = tFooter('columns.contacts.address');
  const phone = tFooter('columns.contacts.phone');
  const email = tFooter('columns.contacts.email');
  const hours = tFooter('columns.contacts.hours');

  type ContactItem = {
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
  };

  const CONTACT_ITEMS: ContactItem[] = [
    { icon: MapPin, label: tFooter('columns.contacts.address_label'), value: address },
    { icon: Phone, label: tFooter('columns.contacts.phone_label'), value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: Mail, label: tFooter('columns.contacts.email_label'), value: email, href: `mailto:${email}` },
    { icon: Clock, label: tFooter('columns.contacts.hours_label'), value: hours },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('page_eyebrow')}
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        breadcrumbs={[{ label: t('breadcrumb') }]}
      />

      {/* Contact details + map */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Details */}
            <div>
              <h2 className="mb-8 font-sans text-2xl font-semibold text-primary">
                {t('office_title')}
              </h2>
              <ul className="space-y-6">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" aria-hidden />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-0.5 font-sans text-base text-primary transition-colors hover:text-accent"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-0.5 font-sans text-base text-primary">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Directions link — открывает Google Maps по точным
                  координатам офиса (Махтумкули 99, Ташкент) */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=41.305230%2C69.328703"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-md border border-accent px-5 py-2.5 font-sans text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
              >
                {t('directions_label')}
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>

            {/* Google Maps embed — те же координаты, что и directions */}
            <div className="overflow-hidden rounded-xl shadow-card-hover">
              <iframe
                title={t('map_label')}
                src="https://www.google.com/maps?q=41.305230,69.328703&z=16&output=embed"
                width="100%"
                height="480"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <ContactSection />
    </>
  );
}
