/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#1A5C3A',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#1A5C3A',
          700: '#0B3D1F',
          800: '#052E14',
          900: '#002110',
        },
        gold: {
          DEFAULT: '#C9963A',
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#C9963A',
          600: '#B8860B',
          700: '#8D6E00',
          800: '#604100',
          900: '#281900',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FFFEFC',
          100: '#FAF7F2',
          200: '#F5F0E6',
          300: '#EDE4D4',
          400: '#E0D4BD',
          500: '#D4C4A6',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
