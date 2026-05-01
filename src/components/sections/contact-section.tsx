'use client';

import { useId, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IMaskInput } from 'react-imask';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Loader2,
  ArrowRight,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ── Validation schema (client-side; consent required here) ── */
const schema = z.object({
  name:    z.string().min(2, '≥ 2 символа'),
  company: z.string().optional(),
  phone:   z.string().min(7, 'Введите корректный телефон'),
  email:   z.string().email('Введите корректный email'),
  message: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Необходимо согласие' }) }),
});

type FormData = z.infer<typeof schema>;

type Status = 'idle' | 'submitting' | 'success' | 'error';

/* ── Inline SVG brand icons ── */
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

/* ── Shared input class factory ── */
const inputCls = (error: boolean) =>
  cn(
    'w-full rounded-sm border px-4 py-3',
    'bg-white/[0.06] text-[15px] text-white',
    'placeholder:text-white/25',
    'outline-none transition-colors duration-200',
    error
      ? 'border-red-400/50 focus:border-red-400/80'
      : 'border-white/15 hover:border-white/28 focus:border-accent/60',
  );

/* ── Field wrapper ── */
type FieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-white/55">
        {label}
        {required && <span className="ml-0.5 text-accent/70"> *</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[12px] text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Custom checkbox ── */
type ConsentProps = {
  label: string;
  error?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  onBlur: () => void;
};

function ConsentField({ label, error, checked, onChange, onBlur }: ConsentProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            className={cn(
              'peer h-4 w-4 cursor-pointer appearance-none rounded-sm',
              'border bg-white/[0.06]',
              'checked:border-accent checked:bg-accent',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              'transition-colors duration-150',
              error ? 'border-red-400/50' : 'border-white/25',
            )}
          />
          {/* Checkmark SVG */}
          <svg
            viewBox="0 0 10 8"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto h-2.5 w-2.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          >
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <label htmlFor={id} className="cursor-pointer text-[13px] leading-relaxed text-white/50">
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-[12px] text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── ContactForm ── */
function ContactForm() {
  const t = useTranslations('home.cta');
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          company: data.company ?? '',
          phone: data.phone,
          email: data.email,
          message: data.message ?? '',
          type: 'contact',
        }),
      });
      const json = (await res.json()) as { ok: boolean };
      if (json.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const onError = () => {
    /* Scroll to first error — handled by browser focus management */
  };

  return (
    <div className="relative min-h-[480px]">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          /* ── Thank-you state ── */
          <motion.div
            key="success"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easing.smooth }}
            className="flex h-full flex-col items-center justify-center gap-5 py-20 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-accent" strokeWidth={1.5} />
            <div>
              <p className="font-serif text-[28px] font-medium text-white">
                {t('form_success_title')}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">
                {t('form_success')}
              </p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 text-[13px] font-medium text-white/40 underline underline-offset-4 hover:text-white/70 transition-colors"
            >
              {/* "Send another request" — implicit via clicking */}
              ← Отправить ещё
            </button>
          </motion.div>
        ) : (
          /* ── Form state ── */
          <motion.form
            key="form"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: easing.snappy }}
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Row: Name + Company */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t('form_name')} error={errors.name?.message} required>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Иван Иванов"
                  {...register('name')}
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field label={t('form_company')} error={errors.company?.message}>
                <input
                  type="text"
                  autoComplete="organization"
                  placeholder="ООО Ромашка"
                  {...register('company')}
                  className={inputCls(!!errors.company)}
                />
              </Field>
            </div>

            {/* Row: Phone + Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t('form_phone')} error={errors.phone?.message} required>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <IMaskInput
                      mask="+0000000000000"
                      value={field.value}
                      onAccept={(value: string) => field.onChange(value)}
                      onBlur={field.onBlur}
                      inputRef={field.ref as React.Ref<HTMLInputElement>}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+998 71 200 00 00"
                      className={inputCls(!!errors.phone)}
                    />
                  )}
                />
              </Field>
              <Field label={t('form_email')} error={errors.email?.message} required>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            {/* Message */}
            <Field label={t('form_message')} error={errors.message?.message}>
              <textarea
                rows={4}
                placeholder="Объём, тип объекта, бюджет…"
                {...register('message')}
                className={cn(inputCls(!!errors.message), 'resize-none')}
              />
            </Field>

            {/* Consent */}
            <Controller
              name="consent"
              control={control}
              defaultValue={false as unknown as true}
              render={({ field }) => (
                <ConsentField
                  label={t('form_consent')}
                  error={errors.consent?.message}
                  checked={!!field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />

            {/* Error banner */}
            {status === 'error' && (
              <p role="alert" className="rounded-sm border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px] text-red-300">
                {t('form_error')}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={cn(
                'mt-2 inline-flex items-center justify-center gap-2 rounded-sm',
                'bg-accent px-8 py-3.5 text-[14px] font-semibold text-white',
                'transition-opacity duration-200',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                status === 'submitting' ? 'cursor-not-allowed opacity-70' : 'hover:opacity-90',
              )}
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t('form_loading')}
                </>
              ) : (
                <>
                  {t('form_submit')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── ContactInfo (right column) ── */
function ContactInfo() {
  const t = useTranslations('home.cta');
  const ft = useTranslations('footer.columns.contacts');

  const quickLinks = [
    {
      label: t('contact_telegram'),
      href: 'https://t.me/riprojects',
      Icon: TelegramIcon,
    },
    {
      label: t('contact_whatsapp'),
      href: 'https://wa.me/998712000000',
      Icon: WhatsAppIcon,
    },
    {
      label: t('contact_call'),
      href: `tel:${ft('phone').replace(/\s/g, '')}`,
      Icon: ({ className }: { className?: string }) => <PhoneCall className={className} aria-hidden />,
    },
  ];

  const details = [
    { Icon: MapPin,    labelKey: 'address_label', valueKey: 'address'  },
    { Icon: PhoneCall, labelKey: 'phone_label',   valueKey: 'phone'    },
    { Icon: Mail,      labelKey: 'email_label',   valueKey: 'email'    },
    { Icon: Clock,     labelKey: 'hours_label',   valueKey: 'hours'    },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      {/* Quick contact CTAs */}
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

      {/* Divider */}
      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="h-1.5 w-1.5 rounded-full bg-warm/50" />
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      {/* Contact details */}
      <div className="flex flex-col gap-5">
        {details.map(({ Icon, labelKey, valueKey }) => (
          <div key={valueKey} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-warm-light" aria-hidden />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {ft(labelKey)}
              </p>
              <p className="mt-0.5 text-[14px] text-white/70">
                {ft(valueKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
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

        {/* Two-column grid
            Desktop: form (left) | contact info (right)
            Mobile:  contact info (top) | form (bottom)
        */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Form — order-2 on mobile, col 1 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: easing.smooth, delay: 0.15 }}
            className="order-2 lg:order-1"
          >
            <ContactForm />
          </motion.div>

          {/* Contact info — order-1 on mobile, col 2 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: easing.smooth, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <ContactInfo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
