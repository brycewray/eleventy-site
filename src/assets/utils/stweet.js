// This is to be the Eleventy shortcode version
// of the `stweet`/`STweet` code I used in
// both Hugo and Astro

const fetch = require('node-fetch')

module.exports = async (user, id) => {

	let stringToRet = ``
	let aspect = '1 / 1'
	let RT_text = ''

	const urlOembed = `https://twitter.com/${user}/status/${id}`;
	const query = `url=${urlOembed}&dnt=true&omit_script=true`;
	const requestUrlO = `https://publish.twitter.com/oembed?` + query;
	const urlSynd = `https://cdn.syndication.twimg.com/tweet?id=${id}`

	const responseUrlSynd = await fetch(urlSynd, {
		method: "get"
	});

	const responseUrlO = await fetch(requestUrlO, {
		method: "get"
	});

	const Json = await responseUrlSynd.json();
	let Text = Json.text;
	let TextBefore = Text; // pre-HTML-subs -- debugging

	const JsonOembed = await responseUrlO.json();
	let JsonOHTML = JsonOembed.html;

	stringToRet += `<p><code>Text</code> =<br />${Text}</p>`
	stringToRet += `<p><code>JsonOHTML</code> = <br />${JsonOHTML}</p>`

	return stringToRet

}
