// https://www.stevenhicks.me/blog/2020/12/generating-social-sharing-images-in-eleventy/

const getShareImage = require('@jlengstorf/get-share-image').default;

module.exports = {
  eleventyComputed: {
    shareImage: (data) => {
      return getShareImage({
        title: data.title,
				cloudName: 'brycewray-com',
				imagePublicID: 'social-OG-bkgd-for-Astro_1280x669',
				textColor: 'ffffff',
				textLeftOffset: 310,
				titleFontSize: 72
      });
    },
  },
};
