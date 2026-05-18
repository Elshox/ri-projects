'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';
import { BitrixForm } from '@/components/integrations/bitrix-form';

/* ─────────────────────────────────────────────────────────────
 *  ContactSection — финальный CTA-блок на главной и /about.
 *
 *  Слева: Bitrix24-форма (CRM пишет лиды напрямую в воронку).
 *  Справа: 3 быстрых способа связи (Telegram, WhatsApp, телефон).
 *
 *  Полный блок с адресом/телефоном/email/часами раньше дублировался
 *  с футером — удалён по запросу: каноничный источник = footer.
 * ───────────────────────────────────────────────────────────── */

/* ── Inline SVG brand icons (нет в lucide) ── */
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.012 9.478c-.151.67-.549.833-1.113.518l-3.088-2.274-1.49 1.433c-.164.164-.302.302-.62.302l.222-3.143 5.717-5.164c.249-.22-.054-.342-.384-.122L7.044 14.57l-3.035-.948c-.66-.206-.673-.66.138-.977l11.857-4.573c.549-.2 1.028.134.558.176z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

/* ── Quick-contact links (правая колонка) ── */
function QuickContacts() {
  const t = useTranslations('home.cta');
  const ft = useTranslations('footer.columns.contacts');

  /* tel-ссылка из footer-значения, чищены все символы кроме цифр и + */
  const telDigits = ft('phone').replace(/[^\d+]/g, '');

  const quickLinks = [
    {
      label: t('contact_telegram'),
      href: 'https://t.me/riprojects',
      Icon: TelegramIcon,
    },
    {
      label: t('contact_whatsapp'),
      href: `https://wa.me/${telDigits.replace(/^\+/, '')}`,
      Icon: WhatsAppIcon,
    },
    {
      label: t('contact_call'),
      href: `tel:${telDigits}`,
      Icon: ({ className }: { className?: string }) => (
        <PhoneCall className={className} aria-hidden />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
        {t('or_divider')}
      </p>
      {quickLinks.map(({ label, href, Icon }) => (
        <a
          key={href}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-sm border border-white/15 bg-white/[0.04]',
            'px-5 py-3.5 text-white/75',
            'transition-colors duration-200 hover:border-white/30 hover:text-white',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          )}
        >
          <Icon className="h-[18px] w-[18px] flex-shrink-0" />
          <span className="text-[14px] font-medium">{label}</span>
          <ArrowRight className="ml-auto h-3.5 w-3.5 text-white/30" aria-hidden />
        </a>
      ))}
    </div>
  );
}

/* ── ContactSection ── */
export function ContactSection() {
  const t = useTranslations('home.cta');
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-bg-dark py-20 sm:py-24 lg:py-32"
    >
      <div className="container mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduce ? { duration: 0 } : { duration: 0.65, ease: easing.smooth }}
          className="mb-14"
        >
          <p className="text-warm-light text-[11px] font-semibold uppercase tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h2
            id="contact-heading"
            className="mt-3 font-sans text-h2-m font-semibold text-white lg:text-h2-d"
          >
            {t('title')}
          </h2>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/55 lg:text-[17px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Two-column grid:
            Desktop: Bitrix form (left, 2/3) | quick links (right, 1/3)
            Mobile:  quick links (top) | Bitrix form (bottom) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Bitrix form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: easing.smooth, delay: 0.15 }}
            className="order-2 lg:order-1 lg:col-span-2"
          >
            <BitrixForm
              loaderUrl="https://cdn-ru.bitrix24.kz/b34929334/crm/form/loader_18.js"
              formPath="inline/18/fsiz0a"
              className="min-h-[480px]"
            />
          </motion.div>

          {/* Quick contacts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: easing.smooth, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <QuickContacts />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
