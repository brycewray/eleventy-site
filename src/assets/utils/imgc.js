/*
This shortcode takes the following form...
  {% imgc url, alt, width, height, tmpl %}
...with url in the form of (note NO leading or ending slash):
  filename.ext
...and 'temp[late]' optional in body copy. The template is used to specify
hero images on post pages ('posts'). Without this parameter, the `switch`
statement below defaults to body copy-style image-handling.
The `animate-fade` CSS class is from the Tailwind CSS config file.
*/

const md5 = require('md5')
const axios = require('axios')

const respSizes = [ 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500 ]
let cloudiBase = 'https://res.cloudinary.com/brycewray-com/image/upload/'
let LQIPholder = 'f_jpg,q_1,w_20/' // note ending slash
let xFmPart1 = 'f_auto,q_auto:eco,w_'
let xFmPart2 = ',x_0,z_1/' // note ending slash

module.exports = async (url, alt, width, height, tmpl) => {
  let imgBmd5 = md5(url)

  if (!tmpl) tmpl == "none"

  switch(tmpl) {
    /* === 'index'case used with home page when it had a hero image (pre-Jan. 2021)
    case 'index':
      divClass = `h-full`
      imgClass = `nScrHidden object-cover object-center h-full w-full containedImage animate-fade`
      nscClass = `imgCover hero`
      dataSzes = `100vw`
      break
    */
    case 'posts':
      divClass = `h-full` // can't use the md5-generated class name here for some reason; insert below
      imgClass = `nScrHidden imgCover hero animate-fade`
      nscClass = `imgCover aspect-[${width}/${height}]`
      dataSzes = `(min-width: 1024px) 100vw, 50vw`
      break
    default:
      divClass = `relative`
      imgClass = `w-full h-auto aspect-[${width}/${height}] animate-fade`
      nscClass = `w-full h-auto aspect-[${width}/${height}]`
      dataSzes = `(min-width: 1024px) 100vw, 50vw`
  }

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

  stringtoRet = `
  <style nonce="DhcnhD3khTMePgXw">
    .imgB-${imgBmd5} {
      background: url(data:image/jpeg;base64,${LQIP_b64});
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  </style>
  <div class="${divClass} imgB-${imgBmd5}">
  <noscript>
    <img class="${nscClass}" src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + url}" alt="${alt}" />
  </noscript>
  <img class="${imgClass}" src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + url}" srcset="`
    respSizes.forEach(size => {
      if (size <= width) {
        arrayFromLoop.push(`${cloudiBase + xFmPart1 + size + xFmPart2 + url} ${size}w`)
      }
    })
    stringtoRet += arrayFromLoop.join(', ')
    // h/t https://stackoverflow.com/questions/2047491/how-to-remove-last-comma
    stringtoRet += `" alt="${alt}" width="${width}" height="${height}"`
    if (tmpl !== "posts") {
      stringtoRet += ` loading="lazy"` // not good for above-the-fold images
    }
    stringtoRet +=` sizes="${dataSzes}" />
  </div>`

  return stringtoRet
}
