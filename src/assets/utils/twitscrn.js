/*
This shortcode takes the following form...
  {% twitscrn imageUrl, alt, width, height, twitterUrl %}
*/

const md5 = require('md5')
const respSizes = [ 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500 ]
var cloudiBase = 'https://res.cloudinary.com/brycewray-com/image/upload/'
var LQIPholder = 'f_auto,q_1,w_20/' // note ending slash
var xFmPart1 = 'f_auto,q_auto:eco,w_'
var xFmPart2 = ',x_0,z_1/' // note ending slash

module.exports = (imageUrl, alt, width, height, twitterUrl) => {
  var imgBmd5 = md5(imageUrl)
  imgClass = `containedImage twitter-tweet animate-fade`
  nscClass = `containedImage animate-fade`
  dataSzes = `(min-width: 1024px) 100vw, 50vw`

  var stringtoRet = ``
  var arrayFromLoop = []

  stringtoRet = `
  <style nonce="DhcnhD3khTMePgXw">.imgB-${imgBmd5} {background-image: url(${cloudiBase + LQIPholder + imageUrl})}</style>
  <div class="relative imgB-${imgBmd5} bg-center bg-no-repeat bg-cover rounded-xl">
  <a href="${twitterUrl}" target="_blank" rel="noopener"><img class="${imgClass}" aspect-ratio="${width} / ${height}" src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + imageUrl}" srcset="`
  respSizes.forEach(size => {
    if (size <= width) {
      arrayFromLoop.push(`${cloudiBase + xFmPart1 + size + xFmPart2 + imageUrl} ${size}w`)
    }
  })
  stringtoRet += arrayFromLoop.join(', ')
  // h/t https://stackoverflow.com/questions/2047491/how-to-remove-last-comma
  stringtoRet += `" alt="${alt}" width="${width}" height="${height}" loading="lazy" sizes="${dataSzes}" /></a>
  </div>`

  return stringtoRet
}
