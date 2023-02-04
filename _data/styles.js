// based on:
// https://darthmall.net/weblog/2020/eleventy-asset-pipeline/

const crypto = require("crypto")
const path = require("path")

const glob = require("glob")
const sass = require("sass")

module.exports = function styles() {
	let stylesheets = []

	// I use glob to generate an array of all the SCSS files.
	// Files prefixed with "_" (SCSS partials) are ignored.
	glob.sync("src/assets/scss/[^_]*.scss").forEach(function (file) {
		const baseName = path.basename(file, ".scss"),
			fileName = `${baseName}.css`

		const output = sass.renderSync({
			file,
			outFile: fileName,
			outputStyle: "compressed",
			sourceMap: true,
		});

		// Create a hash of the contents to use in the filename for cache busting
		// in production.
		const content = output.css.toString("utf8"),
			hash = crypto.createHash("md5")

		hash.update(content)

		const hashedFileName = `${baseName}-${hash
			.digest("hex")
			.slice(0, 10)}.css`

		stylesheets.push({
			fileName,
			hashedFileName,
			content,
		})

		// Include the sourcemap as an asset. There's no need to put a hash in the
		// filename of the source map, but we still need that property present on
		// all assets for our JavaScript Template later on.
		stylesheets.push({
			fileName: `${fileName}.map`,
			hashedFileName: `${fileName}.map`,
			content: output.map.toString("utf8"),
		})
	})

	return stylesheets
}
