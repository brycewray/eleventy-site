// This is to be the Eleventy shortcode version
// of the Hugo full-privacy `tweet` shortcode
// --- use as:
// {% stweetsimple "user", "id" %}

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (user, id) => {

	let stringToRet = ``

	const urlOembed = `https://twitter.com/${user}/status/${id}`;
	const query = `url=${urlOembed}&dnt=true&omit_script=true`;
	const requestUrlO = `https://publish.twitter.com/oembed?` + query;

	const responseUrlO = await fetch(requestUrlO, {
		method: "get"
	});

	const JsonOembed = await responseUrlO.json();
	let JsonOHTML = JsonOembed.html;

	stringToRet += JsonOHTML

	return stringToRet

}
