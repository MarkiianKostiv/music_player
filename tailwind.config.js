/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'main-color': 'var(--color-main)',
        'secondary-color': 'var(--color-secondary)',
        'background-main-color': 'var(--background-main-color)',
      },
    },
  },
  plugins: [],
};
