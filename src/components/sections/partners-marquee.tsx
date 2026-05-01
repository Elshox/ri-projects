'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';

/* ── Partner data ─────────────────────────────────────────────
 *  Manufacturers: PNG логотипы реальных поставщиков из img/suppliers,
 *    скопированы в public/images/partners/<slug>.png.
 *  Clients: SVG placeholders отельных сетей (ещё не реальные —
 *    заменим когда будут согласованные клиентские бренды).
 * ── */
type Partner = {
  slug: string;
  name: string;
  /** Filename in /public/images/partners/. Defaults to `${slug}.svg`. */
  file?: string;
};

const MANUFACTURERS: Partner[] = [
  { slug: 'crystal',     name: 'Crystal',     file: 'crystal.png'     },
  { slug: 'duka',        name: 'Duka',        file: 'duka.png'        },
  { slug: 'elit',        name: 'Elit',        file: 'elit.png'        },
  { slug: 'escom',       name: 'Escom',       file: 'escom.png'       },
  { slug: 'evdema',      name: 'Evdema',      file: 'evdema.png'      },
  { slug: 'geberit',     name: 'Geberit',     file: 'geberit.png'     },
  { slug: 'helead',      name: 'Helead',      file: 'helead.png'      },
  { slug: 'kastamonu',   name: 'Kastamonu',   file: 'kastamonu.png'   },
  { slug: 'kobos',       name: 'Kobos',       file: 'kobos.png'       },
  { slug: 'koer',        name: 'Koer',        file: 'koer.png'        },
  { slug: 'laminam',     name: 'Laminam',     file: 'laminam.png'     },
  { slug: 'naturegreen', name: 'Nature Green', file: 'naturegreen.png' },
  { slug: 'oyaka',       name: 'Oyaka',       file: 'oyaka.png'       },
  { slug: 'quickstep',   name: 'Quick-Step',  file: 'quickstep.png'   },
  { slug: 'rasch',       name: 'Rasch',       file: 'rasch.png'       },
  { slug: 'seltex',      name: 'Seltex',      file: 'seltex.png'      },
  { slug: 'som',         name: 'Som',         file: 'som.png'         },
  { slug: 'tooyei',      name: 'Tooyei',      file: 'tooyei.png'      },
];

const CLIENTS: Partner[] = [
  { slug: 'hilton',    name: 'Hilton'       },
  { slug: 'radisson',  name: 'Radisson'     },
  { slug: 'marriott',  name: 'Marriott'     },
  { slug: 'hyatt',     name: 'Hyatt'        },
  { slug: 'kempinski', name: 'Kempinski'    },
  { slug: 'accor',     name: 'Accor'        },
  { slug: 'ihg',       name: 'IHG'          },
  { slug: 'wyndham',   name: 'Wyndham'      },
  { slug: 'ramada',    name: 'Ramada'       },
  { slug: 'orient',    name: 'Orient Group' },
];

/* ── Scroll-reveal variants ── */
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing.smooth } },
};

/* ── PartnerLogo ── */
function PartnerLogo({ partner, ariaHidden }: { partner: Partner; ariaHidden?: boolean }) {
  return (
    /* Grayscale default; full colour on individual logo hover */
    <div
      aria-hidden={ariaHidden}
      className={cn(
        'flex h-10 w-auto min-w-[80px] items-center justify-center px-6',
        'grayscale opacity-50',
        'transition-[filter,opacity] duration-300',
        'hover:grayscale-0 hover:opacity-100',
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/partners/${partner.file ?? `${partner.slug}.svg`}`}
        alt={ariaHidden ? '' : partner.name}
        width={120}
        height={36}
        loading="lazy"
        className="h-8 w-auto max-w-[140px] object-contain"
      />
    </div>
  );
}

/* ── Marquee row ──────────────────────────────────────────────
 *  Pure CSS animation — runs on compositor thread, no JS per frame.
 *  Two identical copies → translate from 0 to -50% = seamless loop.
 *  group-hover pauses via [animation-play-state:paused].
 * ── */
type MarqueeRowProps = {
  partners: Partner[];
  direction?: 'left' | 'right';
  duration?: number;
  ariaLabel: string;
  className?: string;
};

function MarqueeRow({
  partners,
  direction = 'left',
  duration = 50,
  ariaLabel,
  className,
}: MarqueeRowProps) {
  const reduce = useReducedMotion();

  const animationName = direction === 'left' ? 'ri-marquee-left' : 'ri-marquee-right';

  return (
    <div
      aria-label={ariaLabel}
      role="group"
      className={cn('group relative overflow-hidden', className)}
    >
      {/* Edge fade masks — colour matches section bg (#FAFAFA ≈ bg-card) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background sm:w-24"
      />

      {/* The moving strip — two identical copies inside one animated container */}
      <div
        className={cn(
          'flex w-max items-center',
          !reduce && 'group-hover:[animation-play-state:paused]',
        )}
        style={
          reduce
            ? undefined
            : {
                animation: `${animationName} ${duration}s linear infinite`,
              }
        }
      >
        {/* Copy A — visible to screen readers */}
        {partners.map((p) => (
          <PartnerLogo key={`a-${p.slug}`} partner={p} />
        ))}
        {/* Copy B — aria-hidden duplicate for visual continuity */}
        {partners.map((p) => (
          <PartnerLogo key={`b-${p.slug}`} partner={p} ariaHidden />
        ))}
      </div>
    </div>
  );
}

/* ── PartnersMarquee ── */
export function PartnersMarquee() {
  const t = useTranslations('home.partners');
  const reduce = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <>
      {/* CSS keyframes — defined once, scoped by unique names */}
      <style>{`
        @keyframes ri-marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ri-marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      <section
        aria-labelledby="partners-eyebrow"
        className="bg-background section-padding overflow-hidden"
      >
        <div className="container mx-auto" ref={ref}>
          {/* Eyebrow */}
          <motion.p
            id="partners-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.55, ease: easing.smooth }}
            className="mb-12 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-warm"
          >
            {t('eyebrow')}
          </motion.p>
        </div>

        {/* Row 1 — manufacturers, moves left, 55s cycle */}
        <motion.div
          initial="hidden"
          animate={inView || reduce ? 'visible' : 'hidden'}
          variants={rowVariants}
          transition={{ delay: 0.1 }}
        >
          <MarqueeRow
            partners={MANUFACTURERS}
            direction="left"
            duration={55}
            ariaLabel={t('manufacturers_label')}
            className="py-4"
          />
        </motion.div>

        {/* Divider */}
        <div className="mx-auto my-6 max-w-[160px]" aria-hidden>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-warm/40" />
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>

        {/* Row 2 — clients, moves right, 45s cycle */}
        <motion.div
          initial="hidden"
          animate={inView || reduce ? 'visible' : 'hidden'}
          variants={rowVariants}
          transition={{ delay: 0.2 }}
        >
          <MarqueeRow
            partners={CLIENTS}
            direction="right"
            duration={45}
            ariaLabel={t('clients_label')}
            className="py-4"
          />
        </motion.div>
      </section>
    </>
  );
}
