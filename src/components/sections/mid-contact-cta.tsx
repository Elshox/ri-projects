'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { easing } from '@/lib/motion-presets';
import { BitrixForm } from '@/components/integrations/bitrix-form';

/* ─────────────────────────────────────────────────────────────
 *  MidContactCTA — компактная заявка-форма ПОСРЕДИНЕ страницы,
 *  чтобы пользователи могли конвертироваться сразу после Services,
 *  не докручивая до самого финального ContactSection.
 *
 *  Использует ту же Bitrix24-форму (loader_18 / inline/18/fsiz0a),
 *  что и финальная — после правки BitrixForm дедупликации
 *  per-mount, обе инстанции работают одновременно.
 *
 *  Дизайн: тёмная секция (контраст после светлой Services), короткий
 *  лид-текст слева, форма справа на 2/3 ширины.
 * ───────────────────────────────────────────────────────────── */
export function MidContactCTA() {
  const t = useTranslations('home.cta');
  const reduce = useReducedMotion();

  return (
    <section
      id="mid-contact"
      aria-labelledby="mid-contact-heading"
      className="bg-bg-dark py-20 sm:py-24"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduce ? { duration: 0 } : { duration: 0.65, ease: easing.smooth }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12"
        >
          {/* Текст слева: 2/5 на десктопе, всё внизу — лаконично */}
          <div className="lg:col-span-2 lg:flex lg:flex-col lg:justify-center">
            <p className="text-warm-light text-[11px] font-semibold uppercase tracking-[0.28em]">
              {t('eyebrow')}
            </p>
            <h2
              id="mid-contact-heading"
              className="mt-3 font-sans text-h2-m font-semibold text-white lg:text-[40px] lg:leading-[1.15]"
            >
              {t('title')}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65 lg:text-[16px]">
              {t('subtitle')}
            </p>
          </div>

          {/* Форма справа: 3/5 на десктопе */}
          <div className="lg:col-span-3">
            <BitrixForm
              loaderUrl="https://cdn-ru.bitrix24.kz/b34929334/crm/form/loader_18.js"
              formPath="inline/18/fsiz0a"
              className="min-h-[420px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
