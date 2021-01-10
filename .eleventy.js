const { DateTime } = require("luxon")
const htmlmin = require("html-minifier")
const ErrorOverlay = require("eleventy-plugin-error-overlay")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const svgContents = require("eleventy-plugin-svg-contents")

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss)

  eleventyConfig.addPlugin(svgContents)

  eleventyConfig.setQuietMode(true)

  eleventyConfig.addPassthroughCopy("browserconfig.xml")
  eleventyConfig.addPassthroughCopy("favicon.ico")
  eleventyConfig.addPassthroughCopy("robots.txt")
  eleventyConfig.addPassthroughCopy("./src/assets/js")
  eleventyConfig.addPassthroughCopy("./src/assets/svg")
  eleventyConfig.addPassthroughCopy("./src/images") // not just icons due to that one OG image

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    )
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'America/Chicago' }).toFormat("MMMM d, yyyy")
  })

  eleventyConfig.addFilter("dateStringISO", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd")
  })

  eleventyConfig.addFilter("dateFromTimestamp", (timestamp) => {
    return DateTime.fromISO(timestamp, { zone: "utc" }).toJSDate()
  })

  eleventyConfig.addFilter("dateFromRFC2822", (timestamp) => {
    return DateTime.fromJSDate(timestamp).toISO()
  })

  eleventyConfig.addFilter("readableDateFromISO", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat("LLL d, yyyy h:mm:ss a ZZZZ")
  })

  eleventyConfig.addFilter("pub_lastmod", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "MMMM d, yyyy"
    )
  })

  eleventyConfig.addLayoutAlias(
    "posts",
    "src/_includes/layouts/posts/singlepost.njk"
  )

  /* Markdown plugins */
  // https://www.11ty.dev/docs/languages/markdown/
  // --and-- https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
  // --and-- https://github.com/planetoftheweb/seven/blob/master/.eleventy.js
  let markdownIt = require("markdown-it")
  let markdownItFootnote = require("markdown-it-footnote")
  let markdownItPrism = require("markdown-it-prism")
  let markdownItAttrs = require("markdown-it-attrs")
  let markdownItBrakSpans = require("markdown-it-bracketed-spans")
  let markdownItLinkAttrs = require("markdown-it-link-attributes")
  let markdownItOpts = {
    html: true,
    linkify: false,
    typographer: true,
  }
  const markdownEngine = markdownIt(markdownItOpts)
  markdownEngine.use(markdownItFootnote)
  markdownEngine.use(markdownItPrism)
  markdownEngine.use(markdownItAttrs)
  markdownEngine.use(markdownItBrakSpans)
  markdownEngine.use(markdownItLinkAttrs, {
    pattern: /^https:/,
    attrs: {
      target: "_blank",
      rel: "noreferrer noopener",
    },
  })
  eleventyConfig.setLibrary("md", markdownEngine)

  eleventyConfig.addWatchTarget("src/**/*.js")
  eleventyConfig.addWatchTarget("./src/assets/css/*.css")
  eleventyConfig.addWatchTarget("./src/**/*.md")

  eleventyConfig.setBrowserSyncConfig({
    ...eleventyConfig.browserSyncConfig,
    files: ["src/**/*.js", "src/assets/css/*.css", "src/**/*.md"],
    ghostMode: false,
  })

  eleventyConfig.addPlugin(ErrorOverlay)

  eleventyConfig.addShortcode(
    "lazypicture",
    require("./src/assets/utils/lazy-picture.js")
  )
  eleventyConfig.addShortcode(
    "twitscrn",
    require("./src/assets/utils/twitscrn.js")
  )

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }
    return content
  })

  /* === START, prev/next posts stuff === */
  // https://github.com/11ty/eleventy/issues/529#issuecomment-568257426

  eleventyConfig.addCollection("posts", function (collection) {
    const coll = collection.getFilteredByTag("post")
    for (let i = 0; i < coll.length; i++) {
      const prevPost = coll[i - 1]
      const nextPost = coll[i + 1]
      coll[i].data["prevPost"] = prevPost
      coll[i].data["nextPost"] = nextPost
    }
    return coll
  })

  /* === END, prev/next posts stuff === */

  /* pathPrefix: "/"; */
  return {
    dir: {
      input: "src", // <--- everything else in 'dir' is relative to this directory! https://www.11ty.dev/docs/config/#directory-for-includes
      data: "../_data",
      includes: "_includes",
    },
    templateFormats: ["html", "md", "njk", "11ty.js"],
    passthroughFileCopy: true,
  }
}
