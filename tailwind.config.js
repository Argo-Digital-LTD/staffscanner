const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    // classes that are generated dynamically, e.g. `rounded-${size}` and must
    // be kept
    safeList: [],
    content: [
      './src/_includes/**/*.njk',
      './src/**/*.ts',
      // etc.
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'staffscanner-dark': '#006FD6',
        'staffscanner-mid': '#E0EBFF',
        'staffscanner-light': '#F0F5FF',
        'staffscanner-electric': '#138EFF',
        'staffscanner-orange': '#EA580C',
      },
      transitionProperty: {
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
