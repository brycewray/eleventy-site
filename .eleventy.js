// const fs = require("fs")
const { DateTime } = require("luxon")
// const path = require('path')

module.exports = function(eleventyConfig) {

  eleventyConfig.setQuietMode(true)

  eleventyConfig.addPassthroughCopy("browserconfig.xml")
  eleventyConfig.addPassthroughCopy("favicon.ico")
  eleventyConfig.addPassthroughCopy("robots.txt")
  eleventyConfig.addPassthroughCopy("./src/assets/fonts")
  eleventyConfig.addPassthroughCopy("./src/assets/js")
  eleventyConfig.addPassthroughCopy("_headers") // for CFP as of 2021-10-27

  eleventyConfig.setUseGitIgnore(false) // for the sake of CSS generated just for `head`


  /* --- date-handling --- */

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
    return DateTime.fromJSDate(dateObj, { zone: "America/Chicago" }).toFormat(
      "MMMM d, yyyy"
    )
  })

  /* --- end, date-handling */

  // https://www.11ty.dev/docs/layouts/
  eleventyConfig.addLayoutAlias("base", "layouts/_default/base.njk")
  eleventyConfig.addLayoutAlias("index", "layouts/_default/index.njk")


  /* --- Markdown handling --- */

  // https://www.11ty.dev/docs/languages/markdown/
  // --and-- https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
  // --and-- https://github.com/planetoftheweb/seven/blob/master/.eleventy.js
  let markdownIt = require("markdown-it")
  let markdownItFootnote = require("markdown-it-footnote")
  let markdownItAnchor = require("markdown-it-anchor")
  let markdownItAttrs = require("markdown-it-attrs")
  let markdownItBrakSpans = require("markdown-it-bracketed-spans")
  let markdownItPrism = require("markdown-it-prism")
  let markdownItLinkAttrs = require("markdown-it-link-attributes")
  let markdownItOpts = {
    html: true,
    linkify: false,
    typographer: true,
  }
  const markdownEngine = markdownIt(markdownItOpts)
  markdownEngine.use(markdownItFootnote)
  markdownEngine.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink()
  })
  markdownEngine.use(markdownItAttrs)
  markdownEngine.use(markdownItBrakSpans)
  markdownEngine.use(markdownItPrism)
  markdownEngine.use(markdownItLinkAttrs, {
    matcher(href, config) {
      return href.startsWith("https:");
    },
    attrs: {
      target: "_blank",
      rel: "noreferrer noopener",
    },
  })
  // START, de-bracketing footnotes
  //--- see http://dirtystylus.com/2020/06/15/eleventy-markdown-and-footnotes/
  markdownEngine.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString()
    if (tokens[idx].meta.subId > 0) {
      n += ":" + tokens[idx].meta.subId
    }
    return n
  }
  // END, de-bracketing footnotes
  eleventyConfig.setLibrary("md", markdownEngine)
  /* --- end, Markdown handling --- */


  eleventyConfig.addWatchTarget("src/**/*.js")
  eleventyConfig.addWatchTarget("./src/assets/css/*.css")
  eleventyConfig.addWatchTarget("./src/assets/scss/*.scss")

  // ==== For Eleventy 2.x+
  // eleventyConfig.setServerOptions({
  //   port: 3000, // default is 8080
  //   // showAllHosts: true,
  //   showVersion: true
  // })

  // eleventyConfig.addNunjucksAsyncShortcode(
  //   "stoot",
  //   require("./src/assets/utils/stoot.js")
  // )

  /* pathPrefix: "/"; */
  return {
    dir: {
      input: "src", // <--- everything else in 'dir' is relative to this directory! https://www.11ty.dev/docs/config/#directory-for-includes
      data: "../_data",
      includes: "_includes",
    },
    templateFormats: [
      "html",
      "md",
      "njk",
      "11ty.js"
    ],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  }
}
