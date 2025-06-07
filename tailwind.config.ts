import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // V0 kleuren
        'v0-blue': '#2E9BDA',
        'v0-orange': '#F5B041',
        'v0-red': '#E74C3C',
        'v0-dark': '#1a1a1a',

        // Primaire kleuren
        'deep-blue': '#0F45C5',
        midnight: '#171A31',
        'slate-white': '#F7F9FC',

        // Status kleuren
        'success-green': '#14B870',
        'warning-amber': '#FF9F0A',
        'danger-red': '#FF3B5C',
        'info-teal': '#0ACDDA',

        // Neutrale kleuren
        carbon: '#232429',
        steel: '#616A7D',
        mist: '#A0A9B8',
        cloud: '#E3E6EC',
        snow: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-source-sans)', 'sans-serif'],
        mono: ['var(--font-source-code-pro)', 'monospace'],
        serif: ['var(--font-lora)', 'serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 10s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
