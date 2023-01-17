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
				mediaStuff = mediaStuff + `<div class="mt-2 rounded-xl overflow-hidden grid grid-cols-1 gap-[2px]"><style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
				mediaStuff = mediaStuff + `<img src="${Json.media_attachments[0].url}" alt="Image ${Json.media_attachments[0].id} from toot ${id} on ${instance}" class="tweet-media-img img-${mediaMD5}`;
				if (Json.sensitive) {
					mediaStuff = mediaStuff + ` blur-2xl relative`;
				}
				mediaStuff = mediaStuff + `" loading="lazy"`;
				if (Json.sensitive) {
					mediaStuff = mediaStuff + ` onclick="this.classList.toggle('!blur-none !z-[9999] relative')"`;
				}
				mediaStuff = mediaStuff + `/>`;
				if (Json.sensitive) {
					mediaStuff = mediaStuff + `<div class="absolute font-bold w-full top-[40%] text-white text-center text-2xl leading-tight">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
				}
				mediaStuff = mediaStuff + `</div>`;
			}
			if (Json.media_attachments[0].type == "video") {
				videoStuff = ``;
				videoStuff = videoStuff + `<style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
				videoStuff = videoStuff + `<div class="text-center mt-2 rounded-xl overflow-hidden grid grid-cols-1 gap-[2px]"><video muted playsinline controls class="text-center w-full h-auto aspect-square object-cover img-${mediaMD5}`;
				if (Json.sensitive) {
					videoStuff = videoStuff + ` blur-2xl relative`;
				}
				videoStuff = videoStuff + `"`;
				if (Json.sensitive) {
					videoStuff = videoStuff + ` onclick="this.classList.toggle('!blur-none !z-[9999] relative')"`;
				}
				videoStuff = videoStuff + `><source src="${Json.media_attachments[0].url}"><p class="fluid-xs text-center">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`;
				if (Json.sensitive) {
					videoStuff = videoStuff + `<div class="absolute font-bold w-full top-[40%] text-white text-center text-2xl leading-tight">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
				}
				videoStuff = videoStuff + `</div>`
			}
			if (Json.media_attachments[0].type == "gifv") {
				gifvStuff = ``;
				gifvStuff = gifvStuff + `<style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
				gifvStuff = gifvStuff + `<div class="text-center mt-2 rounded-xl overflow-hidden grid grid-cols-1 gap-[2px]"><video loop autoplay muted playsinline controls controlslist="nofullscreen" class="text-center w-full h-auto aspect-square object-cover img-${mediaMD5}`;
				if (Json.sensitive) {
					gifvStuff = gifvStuff + ` blur-2xl relative`;
				}
				gifvStuff = gifvStuff + `"`;
				if (Json.sensitive) {
					gifvStuff = gifvStuff + ` onclick="this.classList.toggle('!blur-none !z-[9999] relative')"`;
				}
				gifvStuff = gifvStuff + `><source src="${Json.media_attachments[0].url}"><p class="fluid-xs text-center">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`;
				if (Json.sensitive) {
					gifvStuff = gifvStuff + `<div class=""absolute font-bold w-full top-[40%] text-white text-center text-2xl leading-tight">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
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
		cardStuff = cardStuff + `<a href="${Json.card.url}" class="no-underline decoration-transparent text-gray-700 dark:text-gray-300" rel="noopener"><div class="relative md:flex border border-gray-700 dark:border-gray-200 rounded-md mt-4 decoration-transparent overflow-hidden"><div class="flex-100 md:flex-200 relative"><img src="${Json.card.image}" alt="Card image from ${instance} toot ${id}" loading="lazy" class="block m-0 w-full h-full object-cover bg-cover bg-[50%]" /></div><div class="flex-auto overflow-hidden p-3 leading-normal"><p class="font-bold fluid-sm !tracking-normal !leading-normal">${Json.card.title}</p><p class="fluid-xs !leading-normal !tracking-normal">${Json.card.description}</p></div></div></a>`;
	}

	if (Json.poll !== null) {
		votesCount = Json.poll.votes_count;
		let pollIterator = 0;
		pollStuff = ``;
		pollStuff = pollStuff + `<div class="grid grid-cols-[3.5em 0.5fr 1fr] gap-[1em]leading-none">`;
		Json.poll.options.forEach(( options ) => {
			pollStuff = pollStuff + `<div class="col-start-1 text-right"><strong>${((Json.poll.options[pollIterator].votes_count)/(votesCount)).toLocaleString("en", {style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1})}</strong></div><div class="col-start-2"><meter class="w-full" id="vote-count" max="${votesCount}" value=${Json.poll.options[pollIterator].votes_count}></meter></div><div class="col-start-3">${Json.poll.options[pollIterator].title}</div>`;
			pollIterator = ++pollIterator;
		})
		pollStuff = pollStuff + `</div><p class="fluid-xs pt-4">${votesCount} people</p>`;
	}

	if (Json.content) {
		stringToRet = `<blockquote class="fluid-base mx-auto my-auto p-4 border-2 border-gray-700 dark:border-gray-200 rounded-xl bg-white dark:bg-gray-900 w-full md:w-[80%]" cite="${tootLink}" data-pagefind-ignore>
			<div class="flex">
				<a class="mr-2 flex-shrink-0 no-underline" href="https://${instance}/@${Json.account.acct}" rel="noopener"><img class="w-[48px] h-auto rounded-full" src="${Json.account.avatar}" alt="Mastodon avatar for ${handleInst}" loading="lazy" /></a>
				<div class="flex flex-col flex-grow">
					<a class="font-bold text-black dark:text-white fluid-sm lg:fluid-base !tracking-normal no-underline" href="https://${instance}/@${Json.account.acct}" rel="noopener">${Json.account.display_name}</a>
					<a class="text-gray-700 dark:text-gray-200 fluid-xs lg:fluid-sm !leading-none !tracking-normal no-underline" href="https://${instance}/@${Json.account.acct}" rel="noopener">${handleInst}</a>
				</div>
			</div>
			<div class="toot-content py-4">${Json.content}</div>`
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
			let formattedTime = DateTime.fromISO(timeToFormat, { zone: "utc" }).toFormat("h:mm a • MMMM d, yyyy")

			stringToRet += `<div class="mt-4 flex items-center text-gray-500 dark:text-gray-300 fluid-sm !tracking-normal">
				<a href="https://${instance}/@${Json.account.acct}/${Json.id}" class="text-gray-600 dark:text-gray-300 no-underline" rel="noopener">${formattedTime}</a>&nbsp;<span class="fluid-xs">(UTC)</span>
			</div>
		</blockquote>`
	}

	return stringToRet
}
