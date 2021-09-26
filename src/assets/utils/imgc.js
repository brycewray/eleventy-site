/*
This shortcode takes the following form...
  {% imgcHero url, alt, width, height, tmpl %}
...with url in the form of (note NO leading or ending slash):
  filename.ext
...and 'temp[late]' optional in body copy. The template is used to specify
hero images on post pages ('posts'). Without this parameter, the `switch`
statement below defaults to body copy-style image-handling.
The `animate-fade` CSS class is from the Tailwind CSS config file.
*/

const respSizes = [ 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500 ]
var cloudiBase = 'https://res.cloudinary.com/brycewray-com/image/upload/'
var LQIPpholder = 'f_auto,q_1,w_20/' // note ending slash
var xFmPart1 = 'f_auto,q_auto:eco,w_'
var xFmPart2 = ',x_0,z_1/' // note ending slash

module.exports = (url, alt, width, height, tmpl) => {
  if (!tmpl) tmpl == "none"

  switch(tmpl) {
    /* === 'index'case used with home page when it had a hero image (pre-Jan. 2021)
    case 'index':
      divClass = `h-full`
      imgClass = `object-cover object-center h-full w-full containedImage animate-fade`
      nscClass = `imgCover hero`
      dataSzes = `100vw`
      break
    */
    case 'posts':
      divClass = `h-full`
      imgClass = `imgCover hero animate-fade`
      nscClass = `imgCover animate-fade`
      dataSzes = `100vw`
      break
    default:
      divClass = `relative`
      imgClass = `containedImage lazy`
      nscClass = `containedImage animate-fade`
      dataSzes = `(min-width: 1024px) 100vw, 50vw`
  }

  var separator = ', '

  var stringtoRet = ``
  stringtoRet = `<div class="${divClass} bg-center bg-no-repeat bg-cover" style="background-image: url(${cloudiBase + LQIPpholder + url})">
  <noscript>
    <img class="${nscClass}" src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + url}" alt="${alt}" />
  </noscript>
  <img class="${imgClass}" aspect-ratio="${width} / ${height}" data-src="${cloudiBase + xFmPart1 + "600" + xFmPart2 + url}" data-srcset="`
    respSizes.forEach(size => {
      if (size <= width) {
        stringtoRet += `${cloudiBase + xFmPart1 + size + xFmPart2 + url} ${size}w`
        stringtoRet += separator
      }
    })
    stringtoRet = stringtoRet.substring(0, stringtoRet.length - 2) // last one loses the final separator
    stringtoRet += `" alt="${alt}" width="${width}" height="${height}"`
    if (divClass !== "h-full") {
      stringtoRet += ` loading="lazy"` // not good for above-the-fold images
    }
    stringtoRet +=` sizes="${dataSzes}" />
  </div>`

  return stringtoRet
}
