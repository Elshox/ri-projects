import Link from 'next/link';

/**
 * Глобальный 404 — рендерится для запросов вне локализованного дерева.
 * Локализованный 404 живёт в src/app/[locale]/not-found.tsx.
 */
export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body className="flex min-h-screen items-center justify-center bg-white text-[#1a1a1a]">
        <main className="flex flex-col items-center gap-4 px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-[#b4683c]">404</p>
          <h1 className="font-serif text-4xl">Страница не найдена</h1>
          <Link
            href="/ru"
            className="mt-4 inline-flex items-center rounded-sm bg-[#0077c8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            На главную
          </Link>
        </main>
      </body>
    </html>
  );
}
