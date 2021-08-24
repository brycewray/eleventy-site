const fs = require('fs')
const md5 = require('md5')
const globAll = require('glob-all')
const NONCEFILE = '_data/nonce.json'
const DATAFILE = '_data/csshash.json'
const PCSSFILE = 'csshash'
cssFiles = globAll.sync([
  'src/assets/css/*.css'
])
var timestamp = new Date().getUTCMilliseconds()
var randomNo = Math.floor((Math.random() + 2) * timestamp * timestamp)
var md5Random = md5(randomNo)
var nonceResult = `nonce-${md5Random}`
var nonceJSON = `{
  "nonceValue": "${nonceResult}"
}`
fs.writeFileSync(NONCEFILE, nonceJSON)

var cssMd5Total = 0
var cssContent = ''

for(i=0; i<cssFiles.length; i++) {
  cssContent += (fs.readFileSync(cssFiles[i]))
}
cssMd5Total = md5(cssContent)
console.log(`CSS MD5 result =`, cssMd5Total)
console.log(`Random =`, md5Random)

var jsonValue = `{
  "indexCSS": "index-${cssMd5Total}.css"
}`
fs.writeFileSync(DATAFILE, jsonValue)

var txtValue = `index-${cssMd5Total}.css`
fs.writeFileSync(PCSSFILE, txtValue)
// ...the latter because, otherwise, you get the following error:
// The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.
