/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Premium dark palette — near-black with opacity-based hierarchy
        surface: {
          DEFAULT: '#09090b',
          raised: '#111113',
          overlay: '#18181b',
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          DEFAULT: '#6366f1',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Keep backward compat
        brand: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        dark: {
          50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#a1a1aa',
          400: '#71717a', 500: '#52525b', 600: '#3f3f46', 700: '#27272a',
          800: '#18181b', 900: '#111113', 950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-up-delay-1': 'fadeInUp 0.5s ease-out 0.1s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.5s ease-out 0.2s forwards',
        'fade-in-up-delay-3': 'fadeInUp 0.5s ease-out 0.3s forwards',
        'fade-in-up-delay-4': 'fadeInUp 0.5s ease-out 0.4s forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 50%)',
        'card-glow': 'radial-gradient(ellipse at center, rgba(99,102,241,0.06), transparent 70%)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(99,102,241,0.08)',
        'glow': '0 0 40px rgba(99,102,241,0.12)',
        'glow-lg': '0 0 80px rgba(99,102,241,0.15)',
        'glow-accent': '0 0 60px rgba(99,102,241,0.2), 0 0 120px rgba(99,102,241,0.1)',
      },
    },
  },
  plugins: [],
};
