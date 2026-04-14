/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'lr-primary': '#1a120b',
        'lr-secondary': '#2d2016',
        'lr-accent': '#c59d5f',
        'lr-accent-hover': '#b48a4d',
        'lr-brand': '#8b5e3c',
        'lr-brand-hover': '#724b30',
        'lr-green': '#58863e',
        'lr-green-hover': '#446d2c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      animation: {
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
