/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zamba-orange': '#F57C00',
        'zamba-blue': '#1E4ED8',
        'zamba-dark': '#1A1A1A',
        'zamba-gray': '#F5F5F5',
        'primary-orange': '#F57C00',
        'primary-orange-hover': '#E57100',
        'primary-blue': '#1E4ED8',
        'primary-blue-hover': '#1A43B5',
        'primary-dark': '#1A1A1A',
        'primary-gray': '#666666',
        'primary-light': '#F5F5F5'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px'
      }
    },
  },
  plugins: [],
}