/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#051341',
          light: '#1501A1',
        },
        accent: {
          DEFAULT: '#FF4801',
          dark: '#DB2C1D',
        },
        light: '#EFECEC',
      },
    },
  },
  plugins: [],
};
