const fs = require('fs')
const md5 = require('md5')
const fg = require('fast-glob')
const DATAFILE = '_data/csshash.json'
const PCSSFILE = 'csshash'
cssFiles = fg.sync([
  'src/**/*.{css,scss}'
])

var cssMd5Total = 0
var cssContent = ''

for(i=0; i<cssFiles.length; i++) {
  cssContent += (fs.readFileSync(cssFiles[i]))
}
cssMd5Total = md5(cssContent)
console.log(`CSS MD5 result =`, cssMd5Total)

var jsonValue = `{
  "indexCSS": "index-${cssMd5Total}.css"
}`
fs.writeFileSync(DATAFILE, jsonValue)

var txtValue = `index-${cssMd5Total}.css`
fs.writeFileSync(PCSSFILE, txtValue)
// ...the latter because, otherwise, you get the following error:
// The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.
