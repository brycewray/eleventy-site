// for excluding "future" content from production builds
// https://saneef.com/tutorials/hiding-posts-with-future-dates-in-eleventy/
// ... but also in dev
// https://github.com/11ty/eleventy/issues/2060#issuecomment-955777844

const isPageFromFuture = ({ date }) =>
  // process.env.ELEVENTY_ENV === "production" && date.getTime() > Date.now()
	date.getTime() > Date.now()

module.exports = {
  permalink: (data) => {
    const { permalink, page } = data
    if (isPageFromFuture(page) || data.draft) {
			return false
		}
    return permalink
  },
  eleventyExcludeFromCollections: (data) => {
    const { eleventyExcludeFromCollections, page } = data
    if (isPageFromFuture(page) || data.draft) {
			return true
		}
    return eleventyExcludeFromCollections
  },
}
