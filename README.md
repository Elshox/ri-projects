# RI PROJECTS

Премиум B2B-сайт проектного агентства по комплектации коммерческих объектов «под ключ» в Узбекистане и СНГ.

## Стек

| Слой | Технология |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Язык | TypeScript (strict) |
| Стилизация | Tailwind CSS + shadcn/ui (New York / Stone) |
| Анимации | **Motion** (`motion/react` — не framer-motion!) |
| Smooth scroll | Lenis |
| i18n | next-intl — RU + EN |
| Формы | react-hook-form + zod + react-imask |
| Email | Resend |
| Sitemap | next-sitemap |
| Хостинг | Vercel |

## Быстрый старт

```bash
# 1. Зависимости
pnpm install

# 2. Переменные окружения
cp .env.example .env.local
# → Заполни .env.local реальными значениями

# 3. Dev-сервер
pnpm dev
# → http://localhost:3000/ru
```

## Команды

| Команда | Назначение |
|---------|-----------|
| `pnpm dev` | Dev-сервер с hot reload |
| `pnpm build` | Production build + sitemap |
| `pnpm start` | Запуск prod-сборки локально |
| `pnpm lint` | ESLint проверка |
| `pnpm typecheck` | TypeScript без компиляции |
| `pnpm format` | Prettier (write) |
| `pnpm format:check` | Prettier (check only) |
| `pnpm analyze` | Bundle analyzer |

## Структура

```
src/
├── app/
│   ├── [locale]/             # i18n-роутинг (ru / en)
│   │   ├── layout.tsx        # Root layout, Schema.org, skip link
│   │   ├── page.tsx          # Главная (10 секций)
│   │   ├── services/         # /services + /services/[slug]
│   │   ├── sectors/          # /sectors + /sectors/[slug]
│   │   ├── projects/         # /projects + /projects/[slug]
│   │   ├── about/            # /about + /production + /partners
│   │   ├── insights/         # /insights + /insights/[slug]
│   │   └── contacts/         # /contacts
│   └── api/
│       ├── lead/             # POST /api/lead — Telegram + Resend
│       └── og/               # GET /api/og?title= — OG image
├── components/
│   ├── layout/               # Header, Footer, JsonLd, Lenis
│   ├── sections/             # 9 секций главной страницы
│   └── ui/                   # PageHero, Breadcrumb, FAQ, cards
├── content/
│   └── insights/             # MDX статьи (*.mdx)
├── i18n/                     # next-intl routing + request config
├── lib/
│   ├── data/                 # services.ts, sectors.ts, projects.ts, insights.ts
│   ├── motion-presets.ts     # fadeUp, stagger, scaleIn, easing
│   ├── og.ts                 # ogImage() helper
│   └── utils.ts              # cn()
└── messages/
    ├── ru.json               # Русский (основной)
    └── en.json               # English
```

## SEO

- **Metadata**: `generateMetadata` на каждой странице
- **OG Image**: динамическая генерация через `/api/og`
- **Schema.org**: `Organization` + `LocalBusiness` JSON-LD в layout
- **Sitemap**: генерируется автоматически в `postbuild` (`public/sitemap.xml`)
- **Hreflang**: `ru` / `en` / `x-default` через `alternates` в metadata
- **Robots**: `public/robots.txt` генерируется next-sitemap

## Добавление контента

### Новый Insight (статья)
1. Создай MDX файл: `src/content/insights/your-slug.mdx`
2. Добавь метаданные в `src/lib/data/insights.ts`
3. Добавь переводы в `src/messages/ru.json` и `en.json` → `insights.titles.your-slug`

### Новый проект (кейс)
1. Добавь данные в `src/lib/data/projects.ts`
2. Положи фото в `public/images/projects/your-slug.jpg`

### Новый сегмент / услуга
- Sectors: `src/lib/data/sectors.ts` + i18n `sectors.slugs.*` / `sectors.subtitles.*`
- Services: `src/lib/data/services.ts` + i18n `services.slugs.*` / `services.subtitles.*`

## Деплой

Хостинг: **Vercel**. Ветка `main` деплоится автоматически.

Env-переменные настраиваются в [Vercel Dashboard → Environment Variables](https://vercel.com).
Список переменных: `.env.example`.

## Документация

- [`CLAUDE.md`](./CLAUDE.md) — источник истины: бренд, технологии, правила
- [`.env.example`](./.env.example) — шаблон переменных окружения
- [`vercel.json`](./vercel.json) — cache headers, redirects, CSP
