import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Совпадает со всеми путями, кроме API, статики, _next и файлов с расширениями.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
