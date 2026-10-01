export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0e1626',   // deepest background (softened from near-black)
          900: '#141e33',   // main background
          800: '#1c2942',   // card backgrounds
          700: '#283958',   // borders/dividers
        },
        accent: {
          400: '#ffb088',   // lighter hover states
          500: '#ff8c5a',   // primary orange/coral
          600: '#e56b3a',   // pressed/darker
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],  // headings
        body: ['"Inter"', 'sans-serif'],            // body text
      },
    },
  },
  plugins: [],
};
