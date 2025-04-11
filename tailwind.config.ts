import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: 'var(--color-dark)',
        light: 'var(--color-light)',
        darkhover: 'var(--color-darkhover)',
        darker: 'var(--color-darker)',
        textlight: 'var(--color-text-light)',
      },
    },
  },
  plugins: [],
} satisfies Config;
