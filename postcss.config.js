const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-csso')({
      restructure: true
    }),
    purgecss({
      content: [
        './**/*.html',
        './**/*.njk'
      ]
    })
  ],
}
