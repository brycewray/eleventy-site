let envir = process.env.NODE_ENV
// import fs from "fs"
// import fg from "fast-glob"
import { DateTime } from "luxon"
import htmlmin from "html-minifier"
import pluginRss from "@11ty/eleventy-plugin-rss"
import path from "path"
import eleventyImage, { eleventyImagePlugin } from "@11ty/eleventy-img"
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"
import CleanCSS from "clean-css"
import pluginWebc from "@11ty/eleventy-plugin-webc"
import lightningCSS from "@11tyrocks/eleventy-plugin-lightningcss"
import markdownIt from "markdown-it"
import markdownItFootnote from "markdown-it-footnote"
import markdownItAnchor from "markdown-it-anchor"
import markdownItAttrs from "markdown-it-attrs"
import markdownItBrakSpans from "markdown-it-bracketed-spans"
import markdownItPrism from "markdown-it-prism"
import markdownItLinkAttrs from "markdown-it-link-attributes"
import disclaimer from "./src/assets/utils/disclaimer.js"
import imgc from "./src/assets/utils/imgc.js"
import imgcnobg from "./src/assets/utils/imgcnobg.js"
import stweetsimple from "./src/assets/utils/stweetsimple.js"
import stoot from "./src/assets/utils/stoot.js"
import gitinfo from "./src/assets/utils/gitinfo.js"


async function imageShortcode(src, alt, proc, width, height, phn) {
  let sizes = "(min-width: 1024px) 100vw, 50vw"
	let cloudiBase = 'https://res.cloudinary.com/brycewray-com/image/upload/'
	let xFmPart1 = 'f_auto,q_auto:eco'
	let xFmPart2 = ',x_0,z_1/' // note ending slash
  // let srcPrefix = `./src/assets/images/`
  // src = srcPrefix + src
  src = cloudiBase + xFmPart1 + xFmPart2 + src
  // console.log(`Generating image(s) from: ${src}`)
  if (alt === undefined) {
    // Throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsive image from: ${src}`)
  }
  let metadataImg = await eleventyImage(src, {
    // widths: [600, 900, 1500],
		widths: [320, 640, 960, 1280, 1600, 1920],
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

export default (eConfig) => {

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
	// eConfig.addNunjucksShortcode("criticalCSS", critical_CSS_Shortcode)
	// eConfig.addLiquidShortcode("criticalCSS", critical_CSS_Shortcode)
	// eConfig.addJavaScriptFunction("criticalCSS", critical_CSS_Shortcode)
  eConfig.addNunjucksAsyncShortcode("imgc", imgc)
  eConfig.addNunjucksAsyncShortcode("imgcnobg", imgcnobg)
  eConfig.addNunjucksAsyncShortcode("stweetsimple", stweetsimple)
  eConfig.addNunjucksAsyncShortcode("stoot", stoot)
	eConfig.addShortcode("disclaimer", disclaimer)
	// ==================
	eConfig.addNunjucksShortcode("gitinfo", gitinfo)

	// *** PLUGINS
	eConfig.addPlugin(pluginRss)
	eConfig.addPlugin(syntaxHighlight)
	eConfig.addPlugin(pluginWebc, {
		components: './src/_includes/components/*.webc'
	})
	eConfig.addPlugin(lightningCSS)

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
	// if (envir !== "production") {
	// 	eConfig.addPassthroughCopy({
	// 		"./src/assets/css": "css/"
	// 	})
	// }
  eConfig.addPassthroughCopy("./src/assets/fonts")
  eConfig.addPassthroughCopy("./src/assets/js")
  eConfig.addPassthroughCopy("./src/assets/svg")
  eConfig.addPassthroughCopy("./src/images") // not just icons due to that one OG image
  eConfig.addPassthroughCopy("_headers") // for CFP as of 2021-10-27
	eConfig.addPassthroughCopy("./src/_pagefind")
	// eConfig.addPassthroughCopy({
	// 	"./src/_includes/css": "css/"
	// })
	// // eConfig.addPassthroughCopy({
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
    if (this.page.outputPath && this.page.outputPath.endsWith(".html") && (envir === "production")) {
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
