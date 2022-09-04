// This is to be the Eleventy shortcode version
// of the Hugo full-privacy `tweet` shortcode
// --- use as:
// {% stweetsimple "user", "id" %}

const EleventyFetch = require("@11ty/eleventy-fetch")
const environment = process.env.NODE_ENV

// const fetch = (...args) =>
// 	import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (user, id) => {

	let stringToRet = ``

	if (environment === "production") {
		const urlOembed = `https://twitter.com/${user}/status/${id}`;
		const query = `url=${urlOembed}&dnt=true&omit_script=true`;
		const requestUrlO = `https://publish.twitter.com/oembed?` + query;

		async function getTweet(tweetURL) {
			const response = await EleventyFetch(tweetURL, {
				duration: "2w",
				type: "json"
			});
			return response
		}

		// const responseUrlO = await fetch(requestUrlO, {
		// 	method: "get"
		// });
		// const JsonOembed = await responseUrlO.json();
		let JsonOembed = await getTweet(requestUrlO);
		let JsonOHTML = JsonOembed.html;

		stringToRet += JsonOHTML

	} else {
		stringToRet = `<blockquote><p class="legal serif">[Embedded <strong>simple</strong> static tweet will appear here in production.]</p></blockquote>`
	}

	return stringToRet

}
