// This is the Eleventy shortcode version
// of the `stoot`/`SToot` shortcode I've used in
// both Hugo and Astro for static content
// from Mastodon

const EleventyFetch = require("@11ty/eleventy-fetch")
const md5 = require('md5')
const { DateTime } = require("luxon")

module.exports = async (instance, id) => {

	let stringToRet = ``
	let tootLink, handleInst, mediaMD5, urlToGet, mediaStuff, videoStuff, gifvStuff, cardStuff, pollStuff = ''
	let imageCount, votesCount = 0

	urlToGet = `https://` + instance + `/api/v1/statuses/` + id

	async function GetToot(tootURL) {
		const response = await EleventyFetch(tootURL, {
			duration: "2w",
			type: "json"
		});
		return response
	}

	let Json = await GetToot(urlToGet);

	if (Json.account) {
		tootLink = `https://` + instance + `@` + Json.account.acct + `/status/` + id
		handleInst = `@` + Json.account.acct + `@` + instance
	}

	if (Json.media_attachments.length !== 0) {
		// conditional above prohibits images **and** polls, but
		// otherwise I can't frickin' make it not pick some of the
		// **non**-valid stuff below, for some bizarre reason
		mediaMD5 = md5(Json.media_attachments[0].url)
		Json.media_attachments.forEach((type) => {
			if (Json.media_attachments[0].type == "image") {
				imageCount = ++imageCount;
			}
		})
		Json.media_attachments.forEach((type, meta) => {
			if (Json.media_attachments[0].type == "image") {
				mediaStuff = ``;
				mediaStuff = mediaStuff + `<div class="tweet-img-grid-${imageCount}"><style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
				mediaStuff = mediaStuff + `<img src="${Json.media_attachments[0].url}" alt="Image ${Json.media_attachments[0].id} from toot ${id} on ${instance}" class="tweet-media-img img-${mediaMD5}`;
				if (Json.sensitive) {
					mediaStuff = mediaStuff + ` tweet-sens-blur`;
				}
				mediaStuff = mediaStuff + `" loading="lazy"`;
				if (Json.sensitive) {
					mediaStuff = mediaStuff + ` onclick="this.classList.toggle('tweet-sens-blur-no')"`;
				}
				mediaStuff = mediaStuff + `/>`;
				if (Json.sensitive) {
					mediaStuff = mediaStuff + `<div class="blur-text">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
				}
				mediaStuff = mediaStuff + `</div>`;
			}
			if (Json.media_attachments[0].type == "video") {
				videoStuff = ``;
				videoStuff = videoStuff + `<style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
				videoStuff = videoStuff + `<div class="ctr tweet-video-wrapper"><video muted playsinline controls class="ctr tweet-media-img img-${mediaMD5}`;
				if (Json.sensitive) {
					videoStuff = videoStuff + ` tweet-sens-blur`;
				}
				videoStuff = videoStuff + `"`;
				if (Json.sensitive) {
					videoStuff = videoStuff + ` onclick="this.classList.toggle('tweet-sens-blur-no')"`;
				}
				videoStuff = videoStuff + `><source src="${Json.media_attachments[0].url}"><p class="legal ctr">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`;
				if (Json.sensitive) {
					videoStuff = videoStuff + `<div class="blur-text">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
				}
				videoStuff = videoStuff + `</div>`
			}
			if (Json.media_attachments[0].type == "gifv") {
				gifvStuff = ``;
				gifvStuff = gifvStuff + `<style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
				gifvStuff = gifvStuff + `<div class="ctr tweet-video-wrapper"><video loop autoplay muted playsinline controls controlslist="nofullscreen" class="ctr tweet-media-img img-${mediaMD5}`;
				if (Json.sensitive) {
					gifvStuff = gifvStuff + ` tweet-sens-blur`;
				}
				gifvStuff = gifvStuff + `"`;
				if (Json.sensitive) {
					gifvStuff = gifvStuff + ` onclick="this.classList.toggle('tweet-sens-blur-no')"`;
				}
				gifvStuff = gifvStuff + `><source src="${Json.media_attachments[0].url}"><p class="legal ctr">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`;
				if (Json.sensitive) {
					gifvStuff = gifvStuff + `<div class="blur-text">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
				}
				gifvStuff = gifvStuff + `</div>`
			}
		})

		/*
			N.B.:
			The above results in an empty, no-height div
			when there's no image but there **is**
			at least one item in `$media_attachments`.
			Unfortunately, it seems to be the only way
			to accomplish this. Not a good HTML practice,
			but gets the job done.
		*/
	}

	if(Json.card !== null) {
		cardStuff = ``;
		cardStuff = cardStuff + `<a href="${Json.card.url}" rel="noopener"><div class="card"><img src="${Json.card.image}" alt="Card image from ${instance} toot ${id}" loading="lazy" class="tweet-card-img" /><p><span class="card-title">${Json.card.title}</span><br />${Json.card.description}</p></div></a>`;
	}

	if (Json.poll !== null) {
		votesCount = Json.poll.votes_count;
		let pollIterator = 0;
		pollStuff = ``;
		pollStuff = pollStuff + `<div class="tweet-poll-wrapper">`;
		Json.poll.options.forEach(( options ) => {
			pollStuff = pollStuff + `<div class="tweet-poll-count"><strong>${((Json.poll.options[pollIterator].votes_count)/(votesCount)).toLocaleString("en", {style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1})}</strong></div><div class="tweet-poll-meter"><meter id="vote-count" max="${votesCount}" value=${Json.poll.options[pollIterator].votes_count}></meter></div><div class="tweet-poll-title">${Json.poll.options[pollIterator].title}</div>`;
			pollIterator = ++pollIterator;
		})
		pollStuff = pollStuff + `</div><p class="legal tweet-poll-total">${votesCount} people</p>`;
	}

	if (Json.content) {
		stringToRet = `<blockquote class="tweet-card" cite="${tootLink}" data-pagefind-ignore>
			<div class="tweet-header">
				<a class="tweet-profile twitterExt" href="https://${instance}/@${Json.account.acct}" rel="noopener"><img src="${Json.account.avatar}" alt="Mastodon avatar for ${handleInst}" loading="lazy" /></a>
				<div class="tweet-author">
					<a class="tweet-author-name twitterExt" href="https://${instance}/@${Json.account.acct}" rel="noopener">${Json.account.display_name}</a>
					<a class="tweet-author-handle twitterExt" href="https://${instance}/@${Json.account.acct}" rel="noopener">${handleInst}</a>
				</div>
			</div>
			<p class="tweet-body">${Json.content}</p>`
			if (mediaStuff) {
				stringToRet += `<div>${mediaStuff}</div>`
			}
			if (videoStuff) {
				stringToRet += `<div>${videoStuff}</div>`
			}
			if (gifvStuff) {
				stringToRet += `<div>${gifvStuff}</div>`
			}
			if (cardStuff) {
				stringToRet += `<div>${cardStuff}</div>`
			}
			if (pollStuff) {
				stringToRet += `<div>${pollStuff}</div>`
			}

			let timeToFormat = Json.created_at
			let formattedTime = DateTime.fromISO(timeToFormat, { zone: "utc" }).toFormat("h:mm a • MMM d, yyyy")

			stringToRet += `<div class="tweet-footer">
				<a href="https://${instance}/@${Json.account.acct}/${Json.id}" class="tweet-date twitterExt" rel="noopener">${formattedTime}</a>&nbsp;<span class="legal">(UTC)</span>
			</div>
		</blockquote>`
	}

	return stringToRet
}
