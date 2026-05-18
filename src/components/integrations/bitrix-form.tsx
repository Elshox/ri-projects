'use client';

import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
 *  Bitrix24 inline form embed.
 *
 *  Скрипт от Bitrix24 ищет <script data-b24-form="inline/X/Y"> в
 *  DOM, читает его data-атрибуты, и рендерит форму на место этого
 *  script-узла. Поэтому скрипт нужно вставлять не статически
 *  (Next.js его обработает не так), а через DOM API внутри useEffect.
 *
 *  Защита от двойной загрузки: каждая форма имеет уникальный
 *  formPath; перед mount проверяем, что для этого пути ещё нет
 *  загруженного скрипта на странице.
 * ───────────────────────────────────────────────────────────── */

type BitrixFormProps = {
  /** Bitrix loader URL — например loader_18.js */
  loaderUrl: string;
  /** Значение data-b24-form, например "inline/18/fsiz0a" */
  formPath: string;
  /** Опциональный className на обёртку */
  className?: string;
};

export function BitrixForm({ loaderUrl, formPath, className }: BitrixFormProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* Cache-bust per 5 minutes — точно как в оригинальном скрипте Bitrix24. */
    const bust = Math.floor(Date.now() / 180000);
    const src = `${loaderUrl}?${bust}`;

    /* Если уже на странице есть тот же loader для этого formPath —
       не дублируем (на soft-navigation между route'ами форма уже
       могла загрузиться). */
    const dup = document.querySelector<HTMLScriptElement>(
      `script[data-b24-form="${formPath}"]`,
    );
    if (dup) return;

    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    s.dataset.b24Form = formPath;
    s.dataset.skipMoving = 'true';
    mount.appendChild(s);

    return () => {
      /* На unmount чистим только наш script-тег. Сама форма Bitrix24
         может оставить внутри mount свои корневые узлы — их удалит
         следующая mount-инициализация. */
      try {
        mount.removeChild(s);
      } catch {
        /* node moved away by Bitrix24 — ignore */
      }
    };
  }, [loaderUrl, formPath]);

  return <div ref={mountRef} className={className} />;
}
