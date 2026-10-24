export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0e1626',
          900: '#141e33',
          800: '#1c2942',
          700: '#283958',
        },
        accent: {
          400: '#ffb088',
          500: '#ff8c5a',
          600: '#e56b3a',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
