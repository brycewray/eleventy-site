// This is the Eleventy shortcode version
// of the `stweetv2`/`STweetV2` code I've used in
// both Hugo and Astro

const EleventyFetch = require("@11ty/eleventy-fetch")
const environment = process.env.NODE_ENV

// const fetch = (...args) =>
// 	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { DateTime } = require("luxon")

require('dotenv').config()
const BearerToken = process.env.BEARER_TOKEN

module.exports = async (TweetID) => {

	let stringToRet = ``

	if (environment === "production") {

		const jsonURL1 = "https://api.twitter.com/2/tweets?ids="
		const jsonURL2 = "&expansions=author_id,attachments.media_keys&tweet.fields=created_at,text,attachments,entities,source&user.fields=name,username,profile_image_url&media.fields=preview_image_url,type,url,alt_text"

		async function getTweetV2(tweetURL) {
			const response = await EleventyFetch(tweetURL, {
				duration: "2w",
				type: "json",
				fetchOptions: {
					headers: {
						"Authorization": `Bearer ${BearerToken}`
					},
				}
			});
			return response
		}

		const Json = await getTweetV2(jsonURL1 + TweetID + jsonURL2)
		const JsonData = Json.data[0]
		const JsonIncludes = Json.includes

		let text, created_at, profile_image_url, name, username = ''

		name = JsonIncludes.users[0].name
		username = JsonIncludes.users[0].username
		profile_image_url = JsonIncludes.users[0].profile_image_url
		created_at = JsonData.created_at

		text = JsonData.text

		if (JsonData.entities.urls) {
			JsonData.entities.urls.forEach((url) => {
				if (!url.images) {
					if (!url.unwound_url) {
						if (url.display_url.includes ("buff.ly")) {
							text = text.replace(
								url.url,
								`<a href=${url.url} rel="noopener">${url.display_url}</a>`
							)
						} else {
							text = text.replace(
								url.url,
								``
							)
						}
					} else {
						text = text.replace(
							url.url,
							`<a href=${url.url} rel="noopener">${url.display_url}</a>`
						)
					}
				} else {
					text = text.replace(
						url.url,
						`<a href=${url.url} rel="noopener">${url.display_url}</a>`)
				}
			})
		}

		if (JsonData.entities.mentions) {
			JsonData.entities.mentions.forEach((mention) => {
				text = text.replace(
					`@${mention.username}`,
					`<a rel="noopener" href="https://twitter.com/${mention.username}">@${mention.username}</a>`
				)
			})
		}

		if (JsonData.entities.hashtags) {
			JsonData.entities.hashtags.forEach((hashtag) => {
				text = text.replace(
					`#${hashtag.tag}`,
					`<a rel="noopener" href="https://twitter.com/hashtag/${hashtag.tag}?src=hash&ref_src=twsrc">#${hashtag.tag}</a>`
				)
			})
		}

		text = text.replace(/(?:\r\n|\r|\n)/g, '<br/>')

		let imageItems = ''

		if (JsonIncludes.media) {
			JsonIncludes.media.forEach((item) => {
				if (item.url) {
					imageItems = imageItems + `<div class="tweet-img-grid-1"><img class="tweet-media-img" loading="lazy" src=${item.url} alt="" /></div><br />`
				}
			})
		}

		stringToRet = `<blockquote class="tweet-card">
			<div class="tweet-header">
				<a class="tweet-profile" href="https://twitter.com/${username}" rel="noopener">
					<img src="${profile_image_url}" alt="Twitter avatar for ${username}" />
				</a>
				<div class="tweet-author">
					<a class="tweet-author-name" href="https://twitter.com/${username}" rel="noopener">${name}</a>
					<a class="tweet-author-handle" href="https://twitter.com/${username}" rel="noopener">@${username}</a>
				</div>
			</div>
			<p class="tweet-body">${text}</p>
			<span>${imageItems}</span>`

		let timeToFormat = created_at
		let formattedTime = DateTime.fromISO(timeToFormat, { zone: "utc" }).toFormat("h:mm a • MMM d, yyyy")

		stringToRet += `<div class="tweet-footer">
				<a href="https://twitter.com/${username}/status/${TweetID}" class="tweet-date" rel="noopener">${formattedTime}</a>&nbsp;<span class="legal">(UTC)</span>
			</div>
		</blockquote>`

	} else {
		stringToRet = `<blockquote class="tweet-card"><p class="ctr legal">[Embedded static tweet from V2 will appear here in production.]</p></blockquote>`
	}

	return stringToRet

}
