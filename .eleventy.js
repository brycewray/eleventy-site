const { DateTime } = require("luxon")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const htmlmin = require('html-minifier')

module.exports = function (config) {

  config.addPassthroughCopy('src/assets/js')
  
  config.addPassthroughCopy('robots.txt')

  config.addPlugin(pluginRss)

  config.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy")
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  config.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat('MMMM d, yyyy')
  })

  config.addFilter('dateStringISO', dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat('yyyy-MM-dd')
  })

  // https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
  config.addLayoutAlias("posts", "src/_includes/layouts/posts/singlepost.njk")

  /* Markdown plugins */
  // https://www.11ty.dev/docs/languages/markdown/
  // --and-- https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
  // --and-- https://github.com/planetoftheweb/seven/blob/master/.eleventy.js
  let markdownIt = require("markdown-it")
  let markdownItPrism = require("markdown-it-prism")
  let markdownItFootnote = require("markdown-it-footnote")
  let markdownItOpts = {
    html: true,
    linkify: true,
    typographer: true
  }
  const markdownEngine = markdownIt(markdownItOpts)
  markdownEngine.use(markdownItFootnote)
  markdownEngine.use(markdownItPrism)
  config.setLibrary("md", markdownEngine)

  config.addShortcode("lazypicture", require("./src/assets/utils/lazy-picture.js"))

  config.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })
      return minified
    }
    return content
  })

  // Webmentions Filter
  config.addFilter('webmentionsForUrl', (webmentions, url) => {
    const allowedTypes = ['mention-of', 'in-reply-to']
    const clean = content =>
      sanitizeHTML(content, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a'],
        allowedAttributes: {
          a: ['href']
        }
      })

    return webmentions
      .filter(entry => entry['wm-target'] === url)
      .filter(entry => allowedTypes.includes(entry['wm-property']))
      .filter(entry => !!entry.content)
      .map(entry => {
        const { html, text } = entry.content
        entry.content.value = html ? clean(html) : clean(text)
        return entry
      })
  })

  /* pathPrefix: "/"; */
  return {
    dir: {
      input: 'src', // <--- everything else in 'dir' is relative to this directory! https://www.11ty.dev/docs/config/#directory-for-includes
      data: '../_data',
      includes: '_includes'
    },
    templateFormats: [
      'html',
      'md',
      'njk'
    ],
    passthroughFileCopy: true,
  }
}