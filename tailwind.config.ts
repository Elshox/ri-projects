import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/sections/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        lg: '3rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // Brand tokens (CLAUDE.md §3.1)
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: '#FFFFFF',
        },
        warm: {
          DEFAULT: 'var(--color-warm)',
          light: 'var(--color-warm-light)',
          foreground: '#FFFFFF',
        },
        background: 'var(--color-bg)',
        foreground: 'var(--color-primary)',
        'bg-soft': 'var(--color-bg-soft)',
        'bg-dark': 'var(--color-bg-dark)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted)',
        },
        border: 'var(--color-border)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-primary)',
        },
        // shadcn/ui semantic aliases
        input: 'var(--color-border)',
        ring: 'var(--color-accent)',
        secondary: {
          DEFAULT: 'var(--color-bg-soft)',
          foreground: 'var(--color-primary)',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: 'var(--color-primary)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      fontSize: {
        // CLAUDE.md §3.2 — размерная сетка
        'hero-d': ['80px', { lineHeight: '1.05', fontWeight: '400' }],
        'hero-m': ['44px', { lineHeight: '1.1', fontWeight: '400' }],
        'h1-d': ['56px', { lineHeight: '1.1', fontWeight: '400' }],
        'h1-m': ['36px', { lineHeight: '1.15', fontWeight: '400' }],
        'h2-d': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2-m': ['28px', { lineHeight: '1.25', fontWeight: '600' }],
        'h3-d': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'h3-m': ['20px', { lineHeight: '1.35', fontWeight: '500' }],
        'body-d': ['17px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-m': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        button: ['15px', { lineHeight: '1', fontWeight: '600' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      transitionTimingFunction: {
        // CLAUDE.md §3.4 — easing
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
