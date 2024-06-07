/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'blueGray': {
          '900': '#0F172A',
          '800': '#1E293B',
          '600': '#475569',
          '200': '#BFDBFE',
          '100': '#E2E8F0',
        },
      }
    },
  },
  plugins: [],
}