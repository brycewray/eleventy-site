// https://www.stevenhicks.me/blog/2020/12/generating-social-sharing-images-in-eleventy/

const getShareImage = require('@jlengstorf/get-share-image').default;

module.exports = {
  eleventyComputed: {
    shareImage: (data) => {
      return getShareImage({
        title: data.title,
				cloudName: 'brycewray-com',
				imagePublicID: 'social-OG-bkgd-for-Eleventy_1280x669',
				textColor: 'ffffff',
				textLeftOffset: 72,
				titleBottomOffset: 72,
				titleGravity: 'north_west',
				titleFontSize: 84
      });
    },
  },
};

/*
	example response:
	https://res.cloudinary.com/brycewray-com/image/upload/w_1280,h_669,c_fill,q_auto,f_auto/w_760,c_fit,co_rgb:ffffff,g_north_west,x_72,y_72,l_text:arial_84:Wildness%20with%20wildcards%252C%20or%C2%A0why%C2%A0DuckDuckGo%20wouldn%E2%80%99t%C2%A0go/social-OG-bkgd-for-Eleventy_1280x669
*/
