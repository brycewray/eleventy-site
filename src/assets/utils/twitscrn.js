/*
This shortcode takes the following form...
  {% twitscrn imageUrl, alt, width, height, twitterUrl %}
*/

const respSizes = [ 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500 ]
var cloudiBase = 'https://res.cloudinary.com/brycewray-com/image/upload/'
// var LQIPholder = 'f_auto,q_1,w_20/' // note ending slash
var xFmPart1 = 'f_auto,q_auto:best,w_'
var xFmPart2 = ',x_0,z_1/' // note ending slash

module.exports = (imageUrl, alt, width, height, twitterUrl) => {
  imgClass = `containedImage twitter-tweet lazy`
  nscClass = `containedImage animate-fade`
  dataSzes = `(min-width: 1024px) 100vw, 50vw`

  var stringtoRet = ``
  var arrayFromLoop = []

  stringtoRet = `<a href="${twitterUrl}" target="_blank" rel="noopener"><img class="${imgClass}" aspect-ratio="${width} / ${height}" data-src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + imageUrl}" data-srcset="`
  respSizes.forEach(size => {
    if (size <= width) {
      arrayFromLoop.push(`${cloudiBase + xFmPart1 + size + xFmPart2 + imageUrl} ${size}w`)
    }
  })
  stringtoRet += arrayFromLoop.join(', ')
  // h/t https://stackoverflow.com/questions/2047491/how-to-remove-last-comma
  stringtoRet += `" alt="${alt}" width="${width}" height="${height}" loading="lazy" sizes="${dataSzes}" /></a>`

  return stringtoRet
}
