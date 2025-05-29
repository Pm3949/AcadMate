/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  darkMode: 'class', // enables class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',       // blue-500
        'primary-dark': '#2563eb' // blue-600
      }
    },
  },
  plugins: [],
}
