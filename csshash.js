const fs = require('fs')
const md5 = require('md5')
const fg = require('fast-glob')
const DATAFILE = '_data/csshash.json'
const PCSSFILE = 'csshash-out'
const PSCSSFILE = 'scsshash-out'
const PCSSFONTS_INTERFILE = 'cssfonts_interhash-out'
const PSCSSFONTS_INTERFILE = 'scssfonts_interhash-out'
const PCSSINTERVFFILE = 'cssintervfhash-out'
const PSCSSINTERVFFILE = 'scssintervfhash-out'
cssFiles = fg.sync([
  'src/**/*.css'
])
scssFiles = fg.sync([
  'src/**/*.scss'
])

var cssMd5Total = 0
var scssMd5Total = 0
var cssContent = ''
var scssContent = ''

for(i=0; i<cssFiles.length; i++) {
  cssContent += (fs.readFileSync(cssFiles[i]))
}
cssMd5Total = md5(cssContent)
console.log(`CSS MD5 result =`, cssMd5Total)

for(i=0; i<scssFiles.length; i++) {
  scssContent += (fs.readFileSync(scssFiles[i]))
}
scssMd5Total = md5(scssContent)
console.log(`SCSS MD5 result =`, scssMd5Total)

var jsonValue = `{
  "indexCSS": "index-${cssMd5Total}.min.css",
  "indexSCSS": "index-${scssMd5Total}.min.css",
  "fonts_InterCSS": "fonts_Inter-${cssMd5Total}.min.css",
  "fonts_InterSCSS": "fonts_Inter-${scssMd5Total}.min.css",
  "intervfCSS": "intervf-${cssMd5Total}.min.css",
  "intervfSCSS": "intervf-${scssMd5Total}.min.css"
}`
fs.writeFileSync(DATAFILE, jsonValue)

var cssTxtValue = `index-${cssMd5Total}.css`
var scssTxtValue = `index-${scssMd5Total}.css`
var cssfonts_InterTxtValue = `fonts_Inter-${cssMd5Total}.min.css`
var scssfonts_InterTxtValue = `fonts_Inter-${scssMd5Total}.min.css`
var cssintervfTxtValue = `intervf-${cssMd5Total}.min.css`
var scssintervfTxtValue = `intervf-${scssMd5Total}.min.css`
fs.writeFileSync(PCSSFILE, cssTxtValue)
fs.writeFileSync(PSCSSFILE, scssTxtValue)
fs.writeFileSync(PCSSFONTS_INTERFILE, cssfonts_InterTxtValue)
fs.writeFileSync(PSCSSFONTS_INTERFILE, scssfonts_InterTxtValue)
fs.writeFileSync(PCSSINTERVFFILE, cssintervfTxtValue)
fs.writeFileSync(PSCSSINTERVFFILE, scssintervfTxtValue)
// ...the latter because, otherwise, you get the following error:
// The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.
