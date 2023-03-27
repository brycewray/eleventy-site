const fs = require("fs")
const { DateTime } = require("luxon")
const htmlmin = require("html-minifier")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const path = require('path')
const Image = require("@11ty/eleventy-img")
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const CleanCSS = require('clean-css')
const pluginWebc = require("@11ty/eleventy-plugin-webc")

async function imageShortcode(src, alt) {
  let sizes = "(min-width: 1024px) 100vw, 50vw"
  let srcPrefix = `./src/assets/images/`
  src = srcPrefix + src
  console.log(`Generating image(s) from: ${src}`)
  if (alt === undefined) {
    // Throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsive image from: ${src}`)
  }
  let metadataImg = await Image(src, {
    widths: [600, 900, 1500],
    formats: ['webp', 'jpeg'],
    urlPath: "/images/",
    outputDir: "./_site/images/",
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src)
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`
    }
  })
  let lowsrc = metadataImg.jpeg[0]
  let highsrc = metadataImg.jpeg[metadataImg.jpeg.length - 1]
  return `<picture>
    ${Object.values(metadataImg).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`
    }).join("\n")}
    <img
      src="${lowsrc.url}"
      width="${highsrc.width}"
      height="${highsrc.height}"
      alt="${alt}"
      loading="lazy"
      decoding="async">
  </picture>`
}

module.exports = (eConfig) => {

	// *** BEGINNING, DRAFT POSTS STUFF ***
	// https://www.11ty.dev/docs/quicktips/draft-posts/
	// When `permalink` is false, the file is not written to disk
	eConfig.addGlobalData("eleventyComputed.permalink", function() {
		return (data) => {
			// Always skip during non-watch/serve builds
			if ((data.date > Date.now() || data.draft) && !process.env.BUILD_DRAFTS) {
				return false
			}
			return data.permalink
		}
	})
  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
	eConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", function() {
		return (data) => {
			// Always exclude from non-watch/serve builds
			if ((data.date > Date.now() || data.draft) && !process.env.BUILD_DRAFTS) {
				return true
			}
			return data.eleventyExcludeFromCollections
		}
	})
	eConfig.on("eleventy.before", ({runMode}) => {
		// Set the environment variable
		if (runMode === "serve" || runMode === "watch") {
			process.env.BUILD_DRAFTS = true
		}
	})
	// *** END, DRAFT POSTS STUFF ***

  // *** SHORTCODES
	eConfig.addNunjucksAsyncShortcode("image", imageShortcode)
  eConfig.addLiquidShortcode("image", imageShortcode)
  // === Liquid needed if `markdownTemplateEngine` **isn't** changed from Eleventy default
  eConfig.addJavaScriptFunction("image", imageShortcode)

	// *** PLUGINS
	eConfig.addPlugin(pluginRss)
	eConfig.addPlugin(syntaxHighlight)
	eConfig.addPlugin(pluginWebc, {
		components: './src/_includes/components/*.webc'
	})

  eConfig.setQuietMode(true)

	// *** FILTERS
	eConfig.addFilter("assetUrl", function (assetCollection, key) {
		for (let asset of assetCollection) {
			if (asset.data.assetKey === key) return asset.url
		}
		return ""
	})
	eConfig.addFilter("assetContent", function (assetCollection, key) {
		for (let asset of assetCollection) {
			if (asset.data.assetKey === key) return asset.content
		}
		return ""
	})
	eConfig.addFilter("numCommas", function (value) {
		return new Intl.NumberFormat('en-US').format(value)
	})
	// https://www.11ty.dev/docs/quicktips/inline-css/
	eConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles
	})

  // *** PASSTHROUGHS
	eConfig.addPassthroughCopy("browserconfig.xml")
  eConfig.addPassthroughCopy("favicon.ico")
  eConfig.addPassthroughCopy("robots.txt")
  eConfig.addPassthroughCopy("./src/assets/fonts")
  eConfig.addPassthroughCopy("./src/assets/js")
  eConfig.addPassthroughCopy("./src/assets/svg")
  eConfig.addPassthroughCopy("./src/images") // not just icons due to that one OG image
  eConfig.addPassthroughCopy("_headers") // for CFP as of 2021-10-27
	eConfig.addPassthroughCopy("./src/_pagefind")
	// eConfig.addPassthroughCopy("./src/css")
	eConfig.addPassthroughCopy({
		"./src/assets/css/": "css/"
	})
	// eConfig.addPassthroughCopy({
	// 	"./src/assets/css/lite-yt-embed.css": "css/lite-yt-embed.css"
	// })
	// eConfig.addPassthroughCopy({
	// 	"./src/assets/css/prismjs.css": "css/prismjs.css"
	// })
	// eConfig.addPassthroughCopy({
	// 	"./src/assets/css/search-form.css": "css/search-form.css"
	// })
	// eConfig.addPassthroughCopy({
	// 	"./src/assets/css/tables.css": "css/tables.css"
	// })

  eConfig.setUseGitIgnore(false) // for the sake of CSS generated just for `head`

	/* --- date-handling --- */
  eConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    )
  })
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'America/Chicago' }).toFormat("MMMM d, yyyy")
  })
  eConfig.addFilter("dateStringISO", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'America/Chicago' }).toFormat("yyyy-MM-dd")
  })
  eConfig.addFilter("dateFromTimestamp", (timestamp) => {
    return DateTime.fromISO(timestamp, { zone: "utc" }).toJSDate()
  })
  eConfig.addFilter("dateFromRFC2822", (timestamp) => {
    return DateTime.fromJSDate(timestamp).toISO()
  })
  eConfig.addFilter("readableDateFromISO", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat("LLL d, yyyy h:mm:ss a ZZZZ")
  })
  eConfig.addFilter("pub_lastmod", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "America/Chicago" }).toFormat(
      "MMMM d, yyyy"
    )
  })
  eConfig.addFilter("socialDate", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat("MM d, yyyy • h:mm a")
  })
  /* --- end, date-handling */


  // *** LAYOUT ALIASES
	// https://www.11ty.dev/docs/layouts/
  eConfig.addLayoutAlias("base", "layouts/_default/base.njk")
  eConfig.addLayoutAlias("singlepost", "layouts/posts/singlepost.njk")
  eConfig.addLayoutAlias("index", "layouts/_default/index.njk")
  eConfig.addLayoutAlias("about", "layouts/about/about.njk")
  eConfig.addLayoutAlias("contact", "layouts/contact/contact.njk")
  eConfig.addLayoutAlias("privacy", "layouts/privacy/privacy.njk")
  eConfig.addLayoutAlias("search", "layouts/search/search.njk")
  eConfig.addLayoutAlias("sitemap", "layouts/sitemap/sitemap.njk")


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
      // target: "_blank",
      rel: "noopener",
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
  eConfig.setLibrary("md", markdownEngine)

	// h/t: https://edjohnsonwilliams.co.uk/blog/2019-05-04-replicating-jekylls-markdownify-filter-in-nunjucks-with-eleventy/
	eConfig.addNunjucksFilter("markdownify", (markdownString) =>
    markdownEngine.render(markdownString)
  )
  /* --- end, Markdown handling --- */

  // ** WATCH TARGETS
	eConfig.addWatchTarget("./src/**/*.js")
  eConfig.addWatchTarget("./src/**/*.css")
  eConfig.addWatchTarget("./src/**/*.scss")

	eConfig.setServerOptions({
		// enabled: true, // default
    // port: 3000, // default is 8080
    showAllHosts: true,
    showVersion: true
  })

	// *** SHORTCODES
  eConfig.addNunjucksAsyncShortcode(
    "imgc",
    require("./src/assets/utils/imgc.js")
  )
  eConfig.addNunjucksAsyncShortcode(
    "imgcnobg",
    require("./src/assets/utils/imgcnobg.js")
  )
  eConfig.addNunjucksAsyncShortcode(
    "stweetsimple",
    require("./src/assets/utils/stweetsimple.js")
  )
  eConfig.addNunjucksAsyncShortcode(
    "stoot",
    require("./src/assets/utils/stoot.js")
  )
	eConfig.addShortcode(
    "disclaimer",
    require("./src/assets/utils/disclaimer.js")
  )
	// eConfig.addNunjucksShortcode(
	// 	"gitinfo",
	// 	require("./src/assets/utils/gitinfo.js")
	// )


	// *** COLLECTIONS
	// h/t https://github.com/11ty/eleventy/issues/613#issuecomment-999637109
	eConfig.addCollection("everything", (collectionApi) => {
		const macroImport = `{%- import "macros/index.njk" as macro with context -%}`
		let collMacros = collectionApi.getFilteredByGlob('src/**/*.md')
		collMacros.forEach((item) => {
			item.template.frontMatter.content = `${macroImport}\n${item.template.frontMatter.content}`
		})
		return collMacros
	})
	// for RSS/JSON feeds and sitemap.xml collection
	// h/t darth_mall (he/him) on the Eleventy Discord, 2022-09-20
	eConfig.addCollection("feeds", function (collection) {
		const feedsColl = collection.getFilteredByGlob([
			"./src/**/*.md",
		])
		return feedsColl
	})
	// end, RSS/JSON feeds and sitemap.xml collection

  // https://www.11ty.dev/docs/config/#transforms
	eConfig.addTransform("htmlmin", function(content) {
    // Prior to Eleventy 2.0: use this.outputPath instead
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })
      return minified
    }
    return content
  })


	eConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!--more-->"
	})

  // *** WRAPUP
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
      "11ty.js",
			"liq",
			"webc"
    ],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  }
}
