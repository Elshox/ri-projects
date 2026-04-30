# RI PROJECTS

Премиум B2B-сайт проектного агентства по комплектации коммерческих
объектов «под ключ» в Узбекистане и СНГ.

## Стек

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (стиль "New York", base "Stone")
- **Motion** (`motion/react`) — анимации
- **Lenis** — smooth scroll
- **next-intl** — RU + EN i18n
- **react-hook-form** + **zod** — формы
- **Resend** — email
- **Vercel** — хостинг

См. полный гайд в [`CLAUDE.md`](./CLAUDE.md) — это единый источник истины
по бренду, токенам, структуре и правилам работы.

## Старт разработки

```bash
# 1. Установка зависимостей
pnpm install

# 2. Скопировать .env.example -> .env.local и заполнить
cp .env.example .env.local

# 3. Запуск dev-сервера
pnpm dev
# → http://localhost:3000
```

## Команды

| Команда | Назначение |
|---------|-----------|
| `pnpm dev` | Dev-сервер |
| `pnpm build` | Production build |
| `pnpm start` | Запуск prod-сборки |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript проверка |
| `pnpm format` | Prettier write |
| `pnpm analyze` | Bundle analyzer |

## Структура

```
src/
├── app/
│   └── [locale]/         # i18n-роутинг (ru/en)
│       ├── layout.tsx
│       └── page.tsx
├── i18n/                  # next-intl config
│   ├── routing.ts
│   └── request.ts
├── messages/              # переводы
│   ├── ru.json
│   └── en.json
├── lib/
│   ├── motion-presets.ts  # пресеты анимаций
│   └── utils.ts           # cn(), хелперы
├── components/            # shadcn + кастомные
└── middleware.ts          # next-intl middleware
```

## Документы

- [CLAUDE.md](./CLAUDE.md) — техническое ТЗ для Claude Code
- [docs/START_HERE.md](./docs/START_HERE.md) — точка входа в проект
- [docs/INSTALL_SKILLS.md](./docs/INSTALL_SKILLS.md) — установка ui-ux-pro-max skill
- `docs/RI_PROJECTS_TZ_*.docx` — оригинальные ТЗ (3 файла)

## Деплой

Hosting: **Vercel**. Production-ветка `main` деплоится автоматически.

Env-переменные настраиваются в [Vercel Dashboard](https://vercel.com)
(см. список в `.env.example`).
