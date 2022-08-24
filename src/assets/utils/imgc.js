/*
This shortcode takes the following form...
  {% imgc "url", "alt", width, height, "phn" %}
...with url in the form of (note NO leading or ending slash):
  filename.ext
...and "phn" optional.

If 'phn' (for screen caps from phones) is "phn", there's
no LQIP bkgd and the image is rendered at small size on most displays.
If 'phn' is unspecified, default image styling occurs.

The `animate-fade` CSS class is from the Tailwind CSS config file.
*/

const md5 = require('md5')
const axios = require('axios')

const respSizes = [ 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500 ]
let cloudiBase = 'https://res.cloudinary.com/brycewray-com/image/upload/'
let LQIPholder = 'f_jpg,q_1,w_20/' // note ending slash and leading zero in `q`
let xFmPart1 = 'f_auto,q_auto:eco,w_'
let xFmPart2 = ',x_0,z_1/' // note ending slash

module.exports = async (url, alt, width, height, phn) => {
  let imgBmd5 = md5(url)

	divClass = `relative`
	dataSzes = `(min-width: 1024px) 100vw, 50vw`

  /*
  ================================================================
  Fetch the LQIP from Cloudinary and convert it to a Base64 string
  ================================================================
  With immense thanks to "Aankhen" on the Eleventy Discord, 2022-01-22:
  - https://discord.com/channels/741017160297611315/934524410591838249/
  Also, https://stackoverflow.com/questions/41846669/download-an-image-using-axios-and-convert-it-to-base64
  */

  async function getBase64(urlFor64) {
    const response = await axios
      .get(urlFor64, {
        responseType: 'arraybuffer'
      })
    return Buffer.from(response.data, 'binary').toString('base64')
  }

  let LQIP_b64 = await getBase64(cloudiBase + LQIPholder + url)

  /*
  ================================================================
  End, LQIP-to-Base64
  ================================================================
  */

  let stringtoRet = ``
  let arrayFromLoop = []

	if (phn === "phn") {
		imgClass = `img-phn h-auto ctrImg animate-fade`
		stringtoRet += `<div class="${divClass}">`
	} else {
		imgClass = `w-full h-auto animate-fade`
		stringtoRet += `<style nonce="DhcnhD3khTMePgXw">
    .imgB-${imgBmd5} {
      background: url(data:image/jpeg;base64,${LQIP_b64});
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
		</style><div class="${divClass} imgB-${imgBmd5}">`
	}
	stringtoRet += `<img class="${imgClass}" src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + url}" srcset="`
    respSizes.forEach(size => {
      if (size <= width) {
        arrayFromLoop.push(`${cloudiBase + xFmPart1 + size + xFmPart2 + url} ${size}w`)
      }
    })
    stringtoRet += arrayFromLoop.join(', ')
    // h/t https://stackoverflow.com/questions/2047491/how-to-remove-last-comma
    stringtoRet += `" alt="${alt}" width="${width}" height="${height}" sizes="${dataSzes}" /></div>`

  return stringtoRet
}
