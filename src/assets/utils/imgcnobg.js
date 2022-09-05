/*
	This shortcode takes the following form...
		{% imgcnobg "url", "alt", width, height, "phn" %}
	...with url in the form of (note NO leading or ending slash):
		filename.ext
	...and "phn" optional.

	If 'phn' (for screen caps from phones) is "phn", there's
	no LQIP bkgd and the image is rendered at small size on most displays.
	If 'phn' is unspecified, default image styling occurs.

	The `animate-fade` CSS class is from the Tailwind CSS config file.

	This one is just for use with images where we **DON'T**
	want a background image and blur-up effect, such as the
	example image in the post about the Eleventy Image plugin.
*/

const EleventyFetch = require("@11ty/eleventy-fetch")

const respSizes = [ 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500 ]
let cloudiBase = 'https://res.cloudinary.com/brycewray-com/image/upload/'
let LQIPholder = 'f_jpg,q_1,w_20/' // note ending slash and leading zero in `q`
let xFmPart1 = 'f_auto,q_auto:eco,w_'
let xFmPart2 = ',x_0,z_1/' // note ending slash

module.exports = async (url, alt, width, height, phn) => {

	dataSzes = `(min-width: 1024px) 100vw, 50vw`

  let stringToRet = ``
  let arrayFromLoop = []

	if (phn === "phn") {
		imgClass = `img-phn h-auto ctrImg`
	} else {
		imgClass = `w-full h-auto`
	}
	stringToRet += `<div class="relative" data-pagefind-ignore>`
	stringToRet += `<img class="${imgClass}" src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + url}" srcset="`
    respSizes.forEach(size => {
      if (size <= width) {
        arrayFromLoop.push(`${cloudiBase + xFmPart1 + size + xFmPart2 + url} ${size}w`)
      }
    })
    stringToRet += arrayFromLoop.join(', ')
    // h/t https://stackoverflow.com/questions/2047491/how-to-remove-last-comma
    stringToRet += `" alt="${alt}" width="${width}" height="${height}" sizes="${dataSzes}" data-pagefind-ignore /></div>`

  return stringToRet
}
