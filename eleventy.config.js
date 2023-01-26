// const fs = require("fs")
const { DateTime } = require("luxon")
const htmlmin = require("html-minifier")
const pluginRss = require("@11ty/eleventy-plugin-rss")
// const svgContents = require("eleventy-plugin-svg-contents")
const path = require('path')
const Image = require("@11ty/eleventy-img")
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
// const pluginEmbedTweet = require("eleventy-plugin-embed-tweet")
// const pluginRev = require("eleventy-plugin-rev")
// const eleventySass = require("eleventy-sass")
// const UpgradeHelper = require ("@11ty/eleventy-upgrade-help")

async function imageShortcode(src, alt) {
  let sizes = "(min-width: 1024px) 100vw, 50vw"
  let srcPrefix = `./src/assets/images/`
  src = srcPrefix + src
  console.log(`Generating image(s) from:  ${src}`)
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

module.exports = function(eleventyConfig) {

	// *** BEGINNING, DRAFT POSTS STUFF ***
	// https://www.11ty.dev/docs/quicktips/draft-posts/

	// When `permalink` is false, the file is not written to disk

	eleventyConfig.addGlobalData("eleventyComputed.permalink", function() {
		return (data) => {
			// Always skip during non-watch/serve builds
			if ((data.date > Date.now() || data.draft) && !process.env.BUILD_DRAFTS) {
				return false
			}

			return data.permalink
		}
	})

  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
	eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", function() {
		return (data) => {
			// Always exclude from non-watch/serve builds
			if ((data.date > Date.now() || data.draft) && !process.env.BUILD_DRAFTS) {
				return true
			}

			return data.eleventyExcludeFromCollections
		}
	})

	eleventyConfig.on("eleventy.before", ({runMode}) => {
		// Set the environment variable
		if(runMode === "serve" || runMode === "watch") {
			process.env.BUILD_DRAFTS = true
		}
	})

	// *** END, DRAFT POSTS STUFF ***

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode)
  eleventyConfig.addLiquidShortcode("image", imageShortcode)
  // === Liquid needed if `markdownTemplateEngine` **isn't** changed from Eleventy default
  eleventyConfig.addJavaScriptFunction("image", imageShortcode)

  // // If you have other `addPlugin` calls, it’s important that UpgradeHelper is added last.
  // eleventyConfig.addPlugin(UpgradeHelper)
	eleventyConfig.addPlugin(pluginRss)
  // eleventyConfig.addPlugin(svgContents)
	eleventyConfig.addPlugin(syntaxHighlight)
	// eleventyConfig.addPlugin(pluginRev)
	// eleventyConfig.addPlugin(eleventySass, {
	// 	rev: true,
	// 	sass: {
	// 		style: "compressed",
	// 		sourceMap: false
	// 	}
	// })

	// eleventyConfig.addPlugin(pluginEmbedTweet, {
  //   useInlineStyles: false,
  // })

  eleventyConfig.setQuietMode(true)

	// eleventyConfig.setServerPassthroughCopyBehavior("copy")
	// fix for issue in 2.0.0-canary.12 and above

  eleventyConfig.addPassthroughCopy("browserconfig.xml")
  eleventyConfig.addPassthroughCopy("favicon.ico")
  eleventyConfig.addPassthroughCopy("robots.txt")
  eleventyConfig.addPassthroughCopy("./src/assets/fonts")
  eleventyConfig.addPassthroughCopy("./src/assets/js")
  eleventyConfig.addPassthroughCopy("./src/assets/svg")
  eleventyConfig.addPassthroughCopy("./src/images") // not just icons due to that one OG image
  eleventyConfig.addPassthroughCopy("_headers") // for CFP as of 2021-10-27
	eleventyConfig.addPassthroughCopy("./src/_pagefind")
	// eleventyConfig.addPassthroughCopy({
	// 	"./src/assets/css/fonts_LibreFranklin.css": "css/fonts_LibreFranklin.css"
	// })
	// eleventyConfig.addPassthroughCopy({
	// 	"./src/assets/css/lite-yt-embed.css": "css/lite-yt-embed.css"
	// })
	// eleventyConfig.addPassthroughCopy({
	// 	"./src/assets/css/prismjs.css": "css/prismjs.css"
	// })
	// eleventyConfig.addPassthroughCopy({
	// 	"./src/assets/css/search-form.css": "css/search-form.css"
	// })
	// eleventyConfig.addPassthroughCopy({
	// 	"./src/assets/css/tables.css": "css/tables.css"
	// })

  eleventyConfig.setUseGitIgnore(false) // for the sake of CSS generated just for `head`


  eleventyConfig.addFilter("numCommas", function(value) {
		return value.toLocaleString()
	})

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
    return DateTime.fromJSDate(dateObj, { zone: 'America/Chicago' }).toFormat("yyyy-MM-dd")
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
  eleventyConfig.addFilter("socialDate", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat("MM d, yyyy • h:mm a")
  })

  /* --- end, date-handling */


  // https://www.11ty.dev/docs/layouts/
  eleventyConfig.addLayoutAlias("base", "layouts/_default/base.njk")
  eleventyConfig.addLayoutAlias("singlepost", "layouts/posts/singlepost.njk")
  eleventyConfig.addLayoutAlias("index", "layouts/_default/index.njk")
  eleventyConfig.addLayoutAlias("about", "layouts/about/about.njk")
  eleventyConfig.addLayoutAlias("contact", "layouts/contact/contact.njk")
  eleventyConfig.addLayoutAlias("privacy", "layouts/privacy/privacy.njk")
  eleventyConfig.addLayoutAlias("search", "layouts/search/search.njk")
  eleventyConfig.addLayoutAlias("sitemap", "layouts/sitemap/sitemap.njk")


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
  eleventyConfig.setLibrary("md", markdownEngine)

	// h/t: https://edjohnsonwilliams.co.uk/blog/2019-05-04-replicating-jekylls-markdownify-filter-in-nunjucks-with-eleventy/
	eleventyConfig.addNunjucksFilter("markdownify", (markdownString) =>
    markdownEngine.render(markdownString)
  )

  /* --- end, Markdown handling --- */


  eleventyConfig.addWatchTarget("./src/**/*.js")
  eleventyConfig.addWatchTarget("./src/**/*.css")
  eleventyConfig.addWatchTarget("./src/**/*.scss")

	// --- REQUIRES Eleventy v.2.0+
	eleventyConfig.setServerOptions({
		// enabled: true, // default
    port: 3000, // default is 8080
    showAllHosts: true,
    showVersion: true
  })

  eleventyConfig.addNunjucksAsyncShortcode(
    "imgc",
    require("./src/assets/utils/imgc.js")
  )

  eleventyConfig.addNunjucksAsyncShortcode(
    "imgcnobg",
    require("./src/assets/utils/imgcnobg.js")
  )

  // eleventyConfig.addNunjucksAsyncShortcode(
  //   "stweet",
  //   require("./src/assets/utils/stweet.js")
  // )

  // eleventyConfig.addNunjucksAsyncShortcode(
  //   "stweetv2",
  //   require("./src/assets/utils/stweetv2.js")
  // )

  // eleventyConfig.addNunjucksAsyncShortcode(
  //   "stweetsimple",
  //   require("./src/assets/utils/stweetsimple.js")
  // )

  eleventyConfig.addNunjucksAsyncShortcode(
    "stoot",
    require("./src/assets/utils/stoot.js")
  )

	eleventyConfig.addShortcode(
    "disclaimer",
    require("./src/assets/utils/disclaimer.js")
  )

	eleventyConfig.addNunjucksShortcode(
		"gitinfo",
		require("./src/assets/utils/gitinfo.js")
	)

	// h/t https://github.com/11ty/eleventy/issues/613#issuecomment-999637109
	eleventyConfig.addCollection("everything", (collectionApi) => {
		const macroImport = `{%- import "macros/index.njk" as macro with context -%}`
		let collMacros = collectionApi.getFilteredByGlob('src/**/*.md')
		collMacros.forEach((item) => {
			item.template.frontMatter.content = `${macroImport}\n${item.template.frontMatter.content}`
		})
		return collMacros
	})

  // https://www.11ty.dev/docs/config/#transforms
	eleventyConfig.addTransform("htmlmin", function(content) {
    // Prior to Eleventy 2.0: use this.outputPath instead
    if (this.page.outputPath && this.page.outputPath.endsWith(".html") && process.env.PRODUCTION) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })
      return minified
    }
    return content
  })


	// for RSS/JSON feeds and sitemap.xml collection
	// h/t darth_mall (he/him) on the Eleventy Discord, 2022-09-20
	eleventyConfig.addCollection("feeds", function (collection) {
		const feedsColl = collection.getFilteredByGlob([
			"./src/**/*.md",
		])
		return feedsColl
	})
	// end, RSS/JSON feeds and sitemap.xml collection


	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!--more-->"
	})


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
    // passthroughFileCopy: true, // unneeded as of 2.0.0-canary.31
  }
}
