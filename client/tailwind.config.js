/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        rose: {
          primary: '#e8547a',
          dark: '#c03060',
          light: '#f7c5d5',
          blush: '#fde8ef',
        },
        gold: {
          primary: '#d4a853',
          light: '#f5e6c8',
          dark: '#b8892a',
        },
        deep: {
          900: '#0d0515',
          800: '#1a0a10',
          700: '#2d1020',
          600: '#3d1530',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'typewriter': 'typewriter 3s steps(40) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'rose-gradient': 'linear-gradient(135deg, #e8547a, #c03060)',
        'gold-gradient': 'linear-gradient(135deg, #d4a853, #b8892a)',
        'deep-gradient': 'linear-gradient(135deg, #1a0a10 0%, #2d1020 30%, #1a0a20 60%, #0d0515 100%)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
