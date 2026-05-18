'use client';

import { useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
 *  Bitrix24 site-button (открытый виджет «связаться» / онлайн-чат).
 *
 *  Скрипт инжектится один раз глобально — Bitrix24 сам монтирует
 *  плавающую кнопку справа-снизу и управляет её состоянием.
 *
 *  Cache-bust = Date.now()/60000 (~раз в минуту) — как в исходном
 *  снипете от Bitrix24, чтобы клиент быстро видел изменения
 *  настроек виджета без хард-релоада.
 *
 *  Защита от двойной загрузки в SPA: проверяем data-атрибут на
 *  document перед добавлением.
 * ───────────────────────────────────────────────────────────── */
const LOADER_URL =
  'https://cdn-ru.bitrix24.kz/b34929334/crm/site_button/loader_4_xtl580.js';
const MARK_ATTR = 'data-ri-bitrix-chat-loaded';

export function BitrixChatWidget() {
  useEffect(() => {
    if (document.documentElement.hasAttribute(MARK_ATTR)) return;
    document.documentElement.setAttribute(MARK_ATTR, '1');

    const s = document.createElement('script');
    s.async = true;
    s.src = `${LOADER_URL}?${Math.floor(Date.now() / 60000)}`;
    document.head.appendChild(s);
    /* Не размонтируем — виджет должен жить на всём времени сессии. */
  }, []);

  return null;
}
