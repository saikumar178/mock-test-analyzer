module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/nesting': {},
    '@tailwindcss/postcss': {
      tailwindConfig: './tailwind.config.js'
    },
    'autoprefixer': {}
  }
}