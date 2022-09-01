// This is the Eleventy shortcode version
// of the `stweet`/`STweet` code I've used in
// both Hugo and Astro

const EleventyFetch = require("@11ty/eleventy-fetch")

// const fetch = (...args) =>
// 	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { DateTime } = require("luxon")

module.exports = async (user, id) => {

	let stringToRet = ``
	// let aspect = '1 / 1'
	let RT_text = ''

	const urlOembed = `https://twitter.com/${user}/status/${id}`;
	const query = `url=${urlOembed}&dnt=true&omit_script=true`;
	const requestUrlO = `https://publish.twitter.com/oembed?` + query;
	const urlSynd = `https://cdn.syndication.twimg.com/tweet?id=${id}`

	async function getTweet(tweetURL) {
		const response = await EleventyFetch(tweetURL, {
			duration: "2w",
			type: "json"
		});
		return response
	}

	// const responseUrlSynd = await fetch(urlSynd, {
	// 	method: "get"
	// });

	// const responseUrlO = await fetch(requestUrlO, {
	// 	method: "get"
	// });

	let Json = await getTweet(urlSynd);
	let Text = Json.text;
	// let TextBefore = Text; // pre-HTML-subs -- debugging

	// const JsonOembed = await responseUrlO.json();
	let JsonOembed = await getTweet(requestUrlO);
	let JsonOHTML = JsonOembed.html;
		if (Json.in_reply_to_screen_name) {
		RT_text = `Replying to <a href="https://twitter.com/${Json.in_reply_to_screen_name}">@${Json.in_reply_to_screen_name}</a>`;
	}

	if (Json.photos && Json.photos !="") {
		if (Json.entities.media) {
			Json.entities.media.forEach(({ url, display_url }) => {
				JsonOHTML = JsonOHTML.replace(
					`<a href="${url}">${display_url}</a>`,
					`<div class="tweet-img-grid-${Json.photos.length}"><img src="" alt="Image from tweet ${id}" class="tweet-media-img" loading="lazy"></div>`
				)
			})
		}
		Json.photos.forEach((url) => {
			JsonOHTML = JsonOHTML.replace(
				`<img src="" alt="Image from tweet ${id}" class="tweet-media-img" loading="lazy">`,
				`<img src="${Json.photos[0].url}" alt="Image from tweet ${id}" class="tweet-media-img"
				loading="lazy">`
			)
		})
	}

	if (Json.entities) {
		if (Json.entities.user_mentions) {
			Json.entities.user_mentions.forEach(({ screen_name }) => {
				Text = Text.replace(
					`@${screen_name}`,
					`<a rel="noreferrer noopener" href="https://twitter.com/${screen_name}">@${screen_name}</a>`
				)
			})
		}
		if (Json.entities.hashtags) {
			Json.entities.hashtags.forEach((tag) => {
				Text = Text.replace(
					`#${tag.text}`,
					`<a rel="noreferrer noopener" href="https://twitter.com/hashtag/${tag.text}?src=hash&ref_src=twsrc">#${tag.text}</a>`
				)
			})
		}
		if (Json.entities.media) {
			Json.entities.media.forEach(({url, display_url}) => {
				Text = Text.replace(
					`${url}`,
					``
				)
				JsonOHTML = JsonOHTML.replace(
					`<a href="${url}">${display_url}</a>`,
					``
				)
			})
		}
		if (Json.entities.urls) {
			Json.entities.urls.forEach((url) => {
				Text = Text.replace(
					`${url.url}`,
					`${url.display_url}`
				)
			})
		}
	}

	if (Json.quoted_tweet) {
		let QT_text = Json.quoted_tweet.text
		if (Json.quoted_tweet.entities) {
			Json.quoted_tweet.entities.urls.forEach((url) => {
				QT_text = QT_text.replace(
					`${url.url}`,
					`${url.display_url}`
				)
			})
		}
		if (Json.entities) {
			if (Json.entities.urls) {
				Json.entities.urls.forEach((url) => {
					Text = Text.replace (
						`${url.url}`,
						`${url.display_url}`
					)
				})
			}
		}
	}

	JsonOHTML = JsonOHTML.replace(
		`<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">`,
		``
	)
	let RegExRepl = /<\/p>.*/gm
	JsonOHTML = JsonOHTML.replace(
		RegExRepl,
		``
	)

	JsonOHTML = JsonOHTML
		.replace(
			`!<a`,
			`! <a`
		)
		.replace(
			`.<a`,
			`. <a`
		)
		.replace(
			`>https://t.co/QPSmjqXwft`,
			`>brycewray.com`
		)
		.replace(
			`>https://t.co/Oeoaacz8z8`,
			`>brycewray.com/posts/2019/02/…`
		)
		.replace(
			`>https://t.co/ErdQPfeAps`,
			`>brycewray.com/posts/2019/06/…`
		)
		.replace(
			`>https://t.co/RXBMHpqW3e`,
			`>netlify.com/products/analytics/`
		)
		.replace(
			`I’ll`,
			`I’ll`
		)
		.replace(
			`😄<a`,
			`😄 <a`
		)
		.replace(
			`>https://t.co/wB96VIVOLn`,
			`>brycewray.com`
		)
		.replace(
			`<a href="https://t.co/x6y4ksDwrt">https://t.co/x6y4ksDwrt</a>`,
			``
		)
		.replace(
			`users<br>(embedded`,
			`users (embedded`
		)
		.replace(
			`<a href="https://t.co/tryfucEzv5">pic.twitter.com/tryfucEzv5</a>`,
			``
		)
		.replace(
			`<a href="https://t.co/Dit0BhDVLg">pic.twitter.com/Dit0BhDVLg</a>`,
			``
		)
		.replace(
			`<a href="https://t.co/jsuCgadKmE">https://t.co/jsuCgadKmE</a>`,
			``
		)
		.replace(
			`:<a`,
			`: <a`
		)
		.replace(
			`>https://t.co/M2dJYnyAhc`,
			`>11ty.dev/docs/languages…`
		)
		.replace(
			`<a href="https://t.co/GTtPejFT8N">pic.twitter.com/GTtPejFT8N</a>`,
			``
		)
		.replace(
			`>https://t.co/99QL57gPPA`,
			`>brycewray.com`
		)
		.replace(
			`<a href="https://t.co/99QL57yqH8">https://t.co/99QL57yqH8</a>`,
			``
		)
		.replace(
			`>https://t.co/cBGolS1bct`,
			`>hugoconf.io`
		)
		.replace(
			`<a href="https://t.co/6vZvoEoAZU">https://t.co/6vZvoEoAZU</a>`,
			``
		)
		.replace(
			`<a href="https://t.co/Ode2sKCtpG">https://t.co/Ode2sKCtpG</a>`,
			``
		)
		// === following `replace` is problematic for (???) reasons, 2022-08-24 ===
		.replace(
			`>https://t.co/LOmOSrG28e`,
			`>github.com/giscus/giscus/...`
		)
		.replace(
			`<a href="https://t.co/KObTA4I8tk">https://t.co/KObTA4I8tk</a>`,
			`<br /><br /><a href="https://t.co/KObTA4I8tk">astro.build</a>`
		)

	if (Json.card) {
		if (Json.card.url) {
			JsonOHTML = JsonOHTML.replace(
				`<a href="${Json.card.url}">${Json.card.url}</a>"`,
				``
			)
		}
	}

	let tweetLink = `https://twitter.com/${Json.user.screen_name}/status/${id}`;

	stringToRet += `<blockquote class="tweet-card" cite="${tweetLink}">
		<div class="tweet-header">
			<a class="tweet-profile twitterExt" href="https://twitter.com/${Json.user.screen_name}" rel="noopener">
				<img src="${Json.user.profile_image_url_https}" alt="Twitter avatar for ${Json.user.screen_name}" loading="lazy" />
			</a>
			<div class="tweet-author">
				<a class="tweet-author-name twitterExt" href="https://twitter.com/${Json.user.screen_name}" rel="noopener">${Json.user.name}</a>
				<a class="tweet-author-handle twitterExt" href="https://twitter.com/${Json.user.screen_name}" rel="noopener">@${Json.user.screen_name}</a>
			</div>
		</div>`
		if (RT_text) {
			stringToRet += `<p class="pokey tweet-reply-to">${RT_text}</p>`
		}
		stringToRet += `<p class="tweet-body">${JsonOHTML}</p>`

		if (Json.video) {
			if (Json.video.variants) {
				let vidVar_1 = Json.video.variants[1] // for `type: video/mp4`
				let vidVarsL = Json.video.variants.length
				if (vidVarsL == 1) {
					vidVar_1 = Json.video.variants[0]
				}
				let vidType
				Json.video.variants.forEach((variants) => {
					vidType = variants.type // will end up with last one
				})
				let vidVarLast = Json.video.variants[(vidVarsL - 1)] // for `type: gif`
				stringToRet += `<div class="ctr tweet-video-wrapper">`
				if (vidType == "video/gif") {
					stringToRet += `<video loop autoplay muted playsinline controlslist="nofullscreen" class="ctr tweet-media-img"><source src="${vidVarLast.src}" type=${vidVarLast.type}><p class="legal ctr">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`
				}
				if (vidType = "video/mp4") {
					stringToRet += `<video loop autoplay muted playsinline controls class="ctr tweet-media-img"><source src="${vidVarLast.src}" type=${vidVarLast.type}><p class="legal ctr">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`
				}
				stringToRet += `</div>`
			}
		}

		if (Json.card) {
			if (Json.card.binding_values) {
				if (Json.card.binding_values.photo_image_full_size_large) {
					stringToRet += `<a href="${Json.card.binding_values.card_url.string_value}" rel="noopener">
						<div class="card">
							<img src="${Json.card.binding_values.photo_image_full_size_large.image_value.url}" alt="${Json.card.binding_values.photo_image_full_size_large.image_value.alt}" loading="lazy" class="tweet-card-img" />
							<p>
								${Json.card.binding_values.vanity_url.string_value}<br />
								<span class="card-title">${Json.card.binding_values.title.string_value}</span><br />
								${Json.card.binding_values.description.string_value}
							</p>
						</div>
					</a>`
				}
			}
		}

		if (Json.card) {
			if (Json.card.binding_values) {
				if (Json.card.binding_values.player_image_small) {
					stringToRet += `<a href="${Json.card.binding_values.card_url.string_value}" rel="noopener">
						<div class="card tweet-player">
							<img src="${Json.card.binding_values.player_image_small.image_value.url}" alt="${Json.card.binding_values.title.string_value}" loading="lazy" />
							<p>
								${Json.card.binding_values.vanity_url.string_value}<br />
								<span class="card-title">${Json.card.binding_values.title.string_value}</span><br />
								${Json.card.binding_values.description.string_value}
							</p>
						</div>
					</a>`
				}
			}
		}

		let timeToFormat = Json.created_at
		let formattedTime = DateTime.fromISO(timeToFormat).toFormat("h:mm a • MMM d, yyyy")

		stringToRet += `<div class="tweet-footer">
			<a href="https://twitter.com/${Json.user.screen_name}/status/${Json.id_str}" rel="noopener">${formattedTime}</a>&nbsp;<span class="legal">(UTC)</span>
		</div>
	</blockquote>`

	return stringToRet

}
