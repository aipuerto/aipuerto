import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00C9A7',
          foreground: '#0A0F1E',
        },
        secondary: {
          DEFAULT: '#4F8EF7',
          foreground: '#E8F4FD',
        },
        accent: {
          DEFAULT: '#7B61FF',
          foreground: '#E8F4FD',
        },
        background: '#0A0F1E',
        foreground: '#E8F4FD',
        card: {
          DEFAULT: '#111827',
          foreground: '#E8F4FD',
        },
        border: 'rgba(79,142,247,0.15)',
        muted: {
          DEFAULT: '#6B8BA4',
          foreground: '#6B8BA4',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fff',
        },
        ring: '#00C9A7',
        input: 'rgba(79,142,247,0.15)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':
          'radial-gradient(at 40% 20%, #00C9A7 0px, transparent 50%), radial-gradient(at 80% 0%, #4F8EF7 0px, transparent 50%), radial-gradient(at 0% 50%, #7B61FF 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00C9A7, 0 0 10px #00C9A7' },
          '100%': { boxShadow: '0 0 20px #00C9A7, 0 0 40px #00C9A7, 0 0 80px #00C9A7' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
