const fs = require('fs')
const md5 = require('md5')
const DATAFILE = '_data/csshash.json'
const CSSFILE = 'hash-css'

let cssCritical = './src/assets/css/critical.css'

let criticalCSSMd5 = 0
let criticalCSSContent = ''

criticalCSSContent = fs.readFileSync(cssCritical)

criticalCSSMd5 = md5(criticalCSSContent)

console.log(`critical.css MD5 result =`, criticalCSSMd5)
// console.log(`fonts MD5 result =`, fontsMd5)
// console.log(`liteYT MD5 result =`, liteYTMd5)
// console.log(`print MD5 result=`, printMd5)
// console.log(`prismjs MD5 result`, prismjsMd5)
// console.log(`search form MD5`, searchFormMd5)
// console.log(`tables MD5`, tablesMd5)

let jsonValue = `{
  "criticalCSS": "critical-${criticalCSSMd5}.css"
}`

fs.writeFileSync(DATAFILE, jsonValue)

let cssTxtValue = `critical-${criticalCSSMd5}.css`
fs.writeFileSync(CSSFILE, cssTxtValue)
