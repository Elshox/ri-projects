'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { PRIMARY_NAV } from '@/lib/nav-config';
import { Logo } from './logo';
import { LocaleSwitcher } from './locale-switcher';
import { cn } from '@/lib/utils';
import { easing } from '@/lib/motion-presets';

const SCROLL_THRESHOLD = 50; // px — порог переключения header'а в "scrolled" mode

/**
 * Главный header. Sticky прозрачный поверх hero, белеет после ~50px скролла,
 * мобильный бургер раскрывает full-screen overlay-меню.
 *
 * Active-state индикатор — motion.div с layoutId, плавно перетекает между пунктами.
 */
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Только главная имеет dark/video hero, на котором логичен
   * transparent-header с белым текстом. На всех остальных страницах
   * hero беж (PageHero) — белый лого был невидим. usePathname из
   * next-intl возвращает путь без locale-префикса, поэтому "/" =
   * главная для любой локали. Вне главной — фиксируем dark-режим.
   */
  const isHome = pathname === '/';
  const lockDark = !isHome;

  // Подписка на scroll один раз на mount
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Закрываем mobile menu при смене маршрута
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Блокируем scroll body когда открыт mobile-overlay
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Esc → закрыть overlay
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  /* На главной — динамика (transparent → solid), на остальных
     страницах постоянно solid с тёмным текстом. */
  const solid = scrolled || lockDark;
  const variant: 'dark' | 'light' = solid ? 'dark' : 'light';
  const headerTextClass = solid ? 'text-primary' : 'text-white';

  return (
    <>
      <a
        href="#main"
        className="bg-accent sr-only z-50 -translate-y-full rounded-sm px-4 py-2 text-sm font-medium text-white transition focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:translate-y-0"
      >
        {t('header.skip_to_content')}
      </a>

      <motion.header
        initial={false}
        animate={{
          backgroundColor: solid ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0)',
          borderColor: solid ? 'rgba(229,231,235,1)' : 'rgba(229,231,235,0)',
          backdropFilter: solid ? 'blur(12px)' : 'blur(0px)',
          WebkitBackdropFilter: solid ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.35, ease: easing.smooth }}
        style={{ willChange: 'background-color, backdrop-filter' }}
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b',
          'transition-colors duration-300 ease-snappy',
        )}
      >
        <div
          className={cn(
            'container mx-auto flex h-16 items-center justify-between gap-6 lg:h-20',
            headerTextClass,
          )}
        >
          {/* Логотип */}
          <Link href="/" aria-label="RI PROJECTS — на главную" className="shrink-0">
            <Logo variant={variant} />
          </Link>

          {/* Desktop nav — по центру */}
          <nav
            aria-label={t('header.primary_nav')}
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          >
            {PRIMARY_NAV.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-sm px-3 py-2 text-[14px] font-medium transition-colors duration-200',
                    'hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2',
                    solid ? 'focus-visible:outline-accent' : 'focus-visible:outline-white',
                  )}
                >
                  {t(`nav.${item.key}`)}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 30 }
                      }
                      className={cn(
                        'absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full',
                        solid ? 'bg-accent' : 'bg-white',
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster — language + CTA + burger */}
          <div className="flex items-center gap-3 lg:gap-4">
            <LocaleSwitcher variant={variant} className="hidden sm:inline-flex" />

            <Link
              href="/contacts"
              className={cn(
                'hidden lg:inline-flex',
                'items-center rounded-sm px-5 py-2.5 text-[14px] font-semibold transition',
                solid
                  ? 'bg-accent text-white hover:opacity-90'
                  : 'border border-white/60 bg-white/0 text-white hover:bg-white hover:text-primary',
              )}
            >
              {t('header.cta')}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('header.open_menu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                '-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-sm transition lg:hidden',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                solid
                  ? 'text-primary hover:bg-bg-soft focus-visible:outline-accent'
                  : 'text-white hover:bg-white/10 focus-visible:outline-white',
              )}
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('header.open_menu')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="bg-bg-dark fixed inset-0 z-50 flex flex-col text-white lg:hidden"
            style={{ willChange: 'opacity' }}
          >
            <div className="container mx-auto flex h-16 items-center justify-between">
              <Logo variant="light" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t('header.close_menu')}
                className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-sm text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            <motion.nav
              aria-label={t('header.primary_nav')}
              initial="initial"
              animate="animate"
              variants={{
                animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
              }}
              className="container mx-auto flex flex-1 flex-col justify-center gap-1 pb-12"
            >
              {PRIMARY_NAV.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <motion.div
                    key={item.key}
                    variants={{
                      initial: { opacity: 0, y: 12 },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: easing.smooth },
                      },
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block py-3 font-serif text-3xl transition-colors',
                        active ? 'text-white' : 'text-white/70 hover:text-white',
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                variants={{
                  initial: { opacity: 0, y: 12 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: easing.smooth, delay: 0.05 },
                  },
                }}
                className="mt-8 flex items-center gap-6"
              >
                <Link
                  href="/contacts"
                  className="bg-accent inline-flex items-center rounded-sm px-6 py-3 text-[14px] font-semibold text-white"
                >
                  {t('header.cta')}
                </Link>
                <LocaleSwitcher variant="light" />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
