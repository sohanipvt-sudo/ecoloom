/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
          deep: '#1b4332',
          medium: '#2d6a4f',
          pine: '#40916c',
          leaf: '#52b788',
          mint: '#74c69d',
          sage: '#95d5b2',
          pale: '#d8f3dc',
        },
        earth: {
          sand: '#f4f1de',
          cream: '#f8f9fa',
          warm: '#f4f6f0',
          terracotta: '#e07a5f',
          rust: '#d90429',
          amber: '#f77f00',
          gold: '#fcbf49',
          dark: '#3d405b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      boxShadow: {
        'organic': '0 10px 30px -5px rgba(27, 67, 50, 0.08), 0 4px 12px -2px rgba(27, 67, 50, 0.04)',
        'organic-lg': '0 20px 40px -10px rgba(27, 67, 50, 0.12), 0 8px 16px -4px rgba(27, 67, 50, 0.06)',
        'glow-green': '0 0 25px rgba(82, 183, 136, 0.45)',
        'glow-danger': '0 0 20px rgba(217, 4, 41, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
