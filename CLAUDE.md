# CLAUDE.md — Project Context for RI PROJECTS

> Этот файл читается Claude Code автоматически при каждой сессии.
> Здесь — единый источник истины по бренду, технологиям и архитектуре.

---

## 1. О проекте

**RI PROJECTS** — премиум B2B-сайт проектного агентства по комплектации коммерческих объектов «под ключ» в Узбекистане и СНГ.

Сегменты клиентов: отели, рестораны, бизнес-центры, медицинские клиники, учебные заведения, ритейл, банки, жилые комплексы.

Сайт должен соответствовать уровню международных бенчмарков: OCCA Design (UK), Stroud Group (US), IDComplect (RU).

---

## 2. Технологический стек

| Слой | Технология |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Язык | TypeScript |
| Стилизация | Tailwind CSS |
| Анимации | **Motion** (импорт `from "motion/react"` — НЕ framer-motion!) |
| Smooth scroll | Lenis |
| UI-компоненты | shadcn/ui (стиль "New York", base "Stone") |
| Иконки | lucide-react |
| Формы | react-hook-form + zod |
| Email | Resend |
| i18n | next-intl (RU + EN) |
| Hosting | Vercel |

---

## 3. Бренд-токены

### 3.1. Цветовая палитра

```css
:root {
  /* Primary */
  --color-primary: #1A1A1A;        /* основной текст, заголовки */
  --color-accent: #0077C8;          /* CTA-кнопки, ссылки */
  --color-warm: #B4683C;            /* тёплый акцент, иконки */

  /* Backgrounds */
  --color-bg: #FFFFFF;              /* основной фон */
  --color-bg-soft: #F5F1EC;         /* тёплый бежевый — секции */
  --color-bg-dark: #1A1A1A;         /* тёмная секция (CTA + форма) */

  /* Neutrals */
  --color-muted: #6B7280;           /* серый текст */
  --color-border: #E5E7EB;          /* линии и обводки */
  --color-card: #FAFAFA;            /* карточки */
}
```

**Соотношение цветов на странице:**
60% белого + 25% графитового текста + 10% тёплого бежевого + 5% акцентов.

### 3.2. Типографика

```ts
// next/font setup
import { Playfair_Display, Inter } from 'next/font/google';

const serif = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
```

**Размерная сетка:**

| Назначение | Гарнитура | Desktop | Mobile | Вес |
|------------|-----------|---------|--------|-----|
| Hero H1 | Playfair Display | 80px | 44px | 400 |
| H1 страницы | Playfair Display | 56px | 36px | 400 |
| H2 | Inter | 36px | 28px | 600 |
| H3 | Inter | 24px | 20px | 500 |
| Body | Inter | 17px | 16px | 400 |
| Caption | Inter | 14px | 13px | 400 |
| Кнопки | Inter | 15px | 15px | 600 |

### 3.3. Скругления и тени

```css
:root {
  /* Radii */
  --radius-sm: 4px;     /* кнопки, инпуты */
  --radius-md: 8px;     /* карточки */
  --radius-lg: 12px;    /* секции */

  /* Shadows */
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 12px 32px rgba(0, 0, 0, 0.12);
}
```

### 3.4. Easing для анимаций

```ts
// lib/motion-presets.ts
export const easing = {
  smooth: [0.16, 1, 0.3, 1],         // премиум-easing
  spring: { type: 'spring', stiffness: 100, damping: 20 },
  snappy: [0.4, 0, 0.2, 1],          // быстрые transitions
};
```

---

## 4. Главные правила работы

### 4.1. Motion

- Импорт всегда `from "motion/react"`, НЕ `from "framer-motion"`.
- Все компоненты с `motion` имеют `"use client"` в начале файла.
- Для transform-анимаций добавляй `style={{ willChange: "transform" }}`.
- Используй `useReducedMotion()` для accessibility — отключай тяжёлые анимации.
- Используй `useInView` с `once: true` для scroll-reveal — не повторяй анимацию.

### 4.2. Базовые motion-пресеты

```ts
// lib/motion-presets.ts
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export const stagger = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};
```

### 4.3. Изображения

- Всегда `next/image` с правильными `sizes`.
- Формат: WebP/AVIF (Next.js автоматически).
- На карточках: `placeholder="blur"` с blurDataURL.
- На hero: `priority` для LCP.

### 4.4. Адаптивность (Mobile-first)

```ts
// tailwind breakpoints
sm: 640px    // small tablets
md: 768px    // tablets
lg: 1024px   // small desktop
xl: 1280px   // desktop
2xl: 1536px  // large desktop
```

Сайт должен идеально работать на 320px ширины (минимальный мобильный экран).

### 4.5. Что НЕ делать

- ❌ Не использовать `framer-motion` (устарело, теперь `motion`).
- ❌ Не использовать яркие градиенты, неоновые цвета.
- ❌ Не создавать одностраничник — это многостраничный сайт.
- ❌ Не использовать `localStorage`/`sessionStorage` (если только для формы).
- ❌ Не писать inline-стили вместо Tailwind-классов.
- ❌ Не использовать `any` в TypeScript.
- ❌ Не добавлять анимации без useReducedMotion-проверки.
- ❌ Не игнорировать accessibility (focus states, aria, semantic HTML).

---

## 5. Структура сайта

### 5.1. Главная страница (10 секций)

| № | Секция | Файл |
|---|--------|------|
| 1 | Hero (видео + H1 + CTA) | `sections/hero-section.tsx` |
| 2 | Услуги (5 карточек) | `sections/services-section.tsx` |
| 3 | Сегменты (8 карточек) | `sections/sectors-grid.tsx` |
| 4 | Цифры доверия (4 счётчика) | `sections/stats-section.tsx` |
| 5 | Витринные кейсы (Editorial) | `sections/showcase-section.tsx` |
| 6 | Партнёры (marquee) | `sections/partners-marquee.tsx` |
| 7 | Процесс (4 шага) | `sections/process-timeline.tsx` |
| 8 | Insights (3 превью) | `sections/insights-preview.tsx` |
| 9 | CTA + форма | `sections/contact-section.tsx` |
| 10 | Footer (5 колонок) | `layout/footer.tsx` |

### 5.2. Внутренние страницы

```
/services                — список услуг
/services/[slug]          — детальная страница услуги (5 шт)
/sectors                  — список сегментов
/sectors/[slug]           — детальная страница сегмента (8 шт)
/projects                 — все проекты с фильтрами
/projects/[slug]          — детальный кейс
/about                    — о компании
/about/production         — производство
/about/partners           — партнёры
/insights                 — список статей
/insights/[slug]          — статья (MDX)
/contacts                 — контакты + карта
```

### 5.3. Маршрутизация i18n

```
/[locale]/...
```
- `ru` — основной язык (по умолчанию)
- `en` — английский
- На будущее: `uz` — узбекский

---

## 6. Сегменты бизнеса

8 сегментов в порядке приоритета (отражено в навигации):

```ts
export const SECTORS = [
  { slug: 'hotels', name: 'Гостиницы и отели', priority: 1 },
  { slug: 'restaurants', name: 'Рестораны, кафе, бары', priority: 2 },
  { slug: 'residential', name: 'Жилые комплексы', priority: 3 },
  { slug: 'business-centers', name: 'Бизнес-центры', priority: 4 },
  { slug: 'medical', name: 'Медицинские клиники', priority: 5 },
  { slug: 'education', name: 'Учебные заведения', priority: 6 },
  { slug: 'retail', name: 'Торговые объекты', priority: 7 },
  { slug: 'banks', name: 'Банки и финучреждения', priority: 8 },
];
```

## 7. Услуги

5 ключевых услуг:

```ts
export const SERVICES = [
  { slug: 'turnkey', name: 'Комплектация под ключ', icon: 'Boxes' },
  { slug: 'ffe', name: 'FF&E поставка', icon: 'Armchair' },
  { slug: 'ose', name: 'OS&E поставка', icon: 'Package' },
  { slug: 'logistics', name: 'Логистика и таможня', icon: 'Truck' },
  { slug: 'certification', name: 'Сертификация и сопровождение', icon: 'ShieldCheck' },
];
```

---

## 8. SEO-стандарты

### 8.1. Каждая страница должна иметь

- Уникальный `title` (≤ 60 символов).
- Уникальный `description` (140–160 символов).
- Open Graph (`og:title`, `og:description`, `og:image`).
- Twitter Card.
- Canonical URL.
- Hreflang для RU и EN версий.

### 8.2. Schema.org

В `layout.tsx` всегда:
- `Organization`
- `LocalBusiness` (с адресом в Ташкенте)

В блоге:
- `Article` для статей
- `BreadcrumbList`

В кейсах:
- `CreativeWork`

### 8.3. Title-шаблоны

```ts
// Главная
"RI PROJECTS — Комплектация объектов под ключ в Ташкенте"

// Услуга
"[Услуга] | RI PROJECTS"

// Сегмент
"Комплектация [сегмент] — мебель, FF&E, OS&E"

// Кейс
"[Название кейса] | Кейсы RI PROJECTS"
```

---

## 9. Performance-цели

| Метрика | Цель |
|---------|------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |

---

## 10. Контакты для интеграций

Эти env-переменные должны быть настроены в Vercel:

```env
# Telegram bot (для отправки лидов)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Resend (email)
RESEND_API_KEY=...

# Analytics
NEXT_PUBLIC_GA_ID=...

# Site
NEXT_PUBLIC_SITE_URL=https://riprojects.org

# Yandex Metrika
NEXT_PUBLIC_YANDEX_ID=...
```

---

## 11. Workflow-правила для Claude Code

### Перед началом работы

1. Прочитай этот файл полностью.
2. Активируй `ui-ux-pro-max` skill.
3. Используй `motion-mcp` для актуальных примеров анимаций.
4. Проверяй существующие компоненты перед созданием новых.

### При создании нового компонента

1. Проверь, есть ли уже похожий в `/components/`.
2. Используй пресеты из `lib/motion-presets.ts`.
3. Тексты — только из i18n, не хардкодь.
4. Все интерактивные блоки — `"use client"`.
5. Семантический HTML (header, main, footer, nav, article, section).
6. Focus states обязательно.
7. Aria-атрибуты на нестандартных элементах.

### После создания компонента

1. Запусти `npm run lint` — нет ли ошибок.
2. Запусти `npm run build` — собирается ли.
3. Запусти dev-сервер — визуально проверь.
4. Закомить с осмысленным сообщением (`feat:`, `fix:`, `style:`).

### При работе с формами

- Валидация через zod на клиенте И на сервере.
- Loading/success/error states обязательны.
- Phone маска: +998 / +7 / +375 / +380.
- Email — real-time валидация.

---

## 12. Команды для разработки

```bash
# Dev
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run typecheck

# Format
npm run format

# Bundle analysis
ANALYZE=true npm run build
```

---

## 13. Полезные ссылки

- ТЗ Часть 1 (Sitemap + Design Brief + Wireframe): см. файл `RI_PROJECTS_TZ_sitemap_design_wireframe.docx`
- ТЗ Часть 2 (Контент-план + Тексты): см. файл `RI_PROJECTS_content_photo_designer_copy.docx`
- ТЗ Часть 3 (это ТЗ для Claude Code): `RI_PROJECTS_TZ_for_Claude_Code.docx`
- Motion docs: https://motion.dev/docs/react
- ui-ux-pro-max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- shadcn/ui: https://ui.shadcn.com
- next-intl: https://next-intl-docs.vercel.app
- git repo: https://github.com/Elshox/ri-projects.git
---

**Этот файл — живой документ. Обновляй его при изменении бренд-системы, добавлении новых сегментов или услуг, изменении структуры навигации.**

*Last updated: 2026-05-16*
