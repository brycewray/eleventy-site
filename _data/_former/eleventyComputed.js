// // for excluding "future" content from production builds
// // https://saneef.com/tutorials/hiding-posts-with-future-dates-in-eleventy/
// // ... but also in dev
// // https://github.com/11ty/eleventy/issues/2060#issuecomment-955777844

// let bothModes = true
// // `true` means both prod and dev
// // `false` means prod only

// const isPageFromFuture = ({ date }) =>
// 	date.getTime() > Date.now()

// if (bothModes) {
// 	// prod and dev
// 	module.exports = {
// 		permalink: (data) => {
// 			const { permalink, page } = data
// 			if (isPageFromFuture(page) || data.draft) {
// 				return false
// 			}
// 			return permalink
// 		},
// 		eleventyExcludeFromCollections: (data) => {
// 			const { eleventyExcludeFromCollections, page } = data
// 			if (isPageFromFuture(page) || data.draft) {
// 				return true
// 			}
// 			return eleventyExcludeFromCollections
// 		},
// 	}
// } else {
// 	// prod only
// 	module.exports = {
// 		permalink: (data) => {
// 			const { permalink, page } = data
// 			if (process.env.ELEVENTY_ENV === "production" && (isPageFromFuture(page) || data.draft)) {
// 				return false
// 			}
// 			return permalink
// 		},
// 		eleventyExcludeFromCollections: (data) => {
// 			const { eleventyExcludeFromCollections, page } = data
// 			if (process.env.ELEVENTY_ENV === "production" && (isPageFromFuture(page) || data.draft)) {
// 				return true
// 			}
// 			return eleventyExcludeFromCollections
// 		},
// 	}
// }
