/** @type {import('tailwindcss').Config} */
export default {
  // content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        wb: ['wb', 'sans-serif'],
        wb500: ['wb-500', 'sans-serif'],
        wbBold: ['wb-bold', 'sans-serif'],
        montserrat500: ['montserrat-500', 'sans-serif'],
        montserratBold: ['montserrat-bold', 'sans-serif'],
      },
      backgroundColor: {
        'green-primary': '#61d78e',
        'green-hover': 'rgba(97,215,142,.83)',
        'dark-elevated-1': '#1c1c1c',
        'dark-elevated-2': '#1f1f1f',
        'dark-elevated-3': '#222222',
        'dark-elevated-4': '#252525',
        'white-opacity-20': 'rgba(255,255,255,.2)',
      },
      textColor: {
        'green-primary': '#61d78e',
        'white-primary': '#fafafa',
        'white-opacity-20': 'rgba(255,255,255,.2)',
        'white-opacity-30': 'rgba(255,255,255,.3)',
        'white-opacity-70': 'rgba(255,255,255,.7)',
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        'green-primary': '#61d78e',
        'white-opacity-20': 'rgba(255,255,255,.2)',
        'grey-1': '#252525',
        warning: 'rgba(245, 158, 11,.55)',
      },
    },
  },
  plugins: [],
}
