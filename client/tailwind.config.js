/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        templateBg: '#f8fafc',
        cardBg: '#ffffff',
      },
      boxShadow: {
        'template': '0 20px 40px -15px rgba(124, 58, 237, 0.08)',
        'pill': '0 10px 30px -5px rgba(124, 58, 237, 0.15)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'template-gradient': 'linear-gradient(180deg, #f3e8ff 0%, #f8fafc 50%, #ffffff 100%)',
        'purple-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      },
    },
  },
  plugins: [],
}
