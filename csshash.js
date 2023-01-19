const fs = require('fs')
const md5 = require('md5')
// const fg = require('fast-glob')
const DATAFILE = '_data/csshash.json'
const INDEXFILE = 'hash-css'
// const FONTSFILE = 'hash-fonts'
// const LITEYTFILE = 'hash-liteyt'
// const PRINTFILE = 'hash-print'
// const CODEFILE = 'hash-prismjs'
// const SEARCHFORMFILE = 'hash-searchform'
// const TABLESFILE = 'hash-tables'

let cssIndex = './src/assets/css/index.css'
// let cssFonts = './src/assets/css/fonts_LibreFranklin.css'
// let cssLiteYT = './src/assets/css/lite-yt-embed.css'
// let cssPrint = './src/assets/css/print.css'
// let cssCode = './src/assets/css/prismjs.css'
// let cssSearchForm = './src/assets/css/search-form.css'
// let cssTables = './src/assets/css/tables.css'

let indexMd5, fontsMd5, liteYTMd5, printMd5, prismjsMd5, searchFormMd5, tablesMd5 = 0
let indexContent, fontsContent, liteYTContent, printContent, prismjsContent, searchContent, tablesContent = ''

indexContent = fs.readFileSync(cssIndex)
// fontsContent = fs.readFileSync(cssFonts)
// liteYTContent = fs.readFileSync(cssLiteYT)
// printContent = fs.readFileSync(cssPrint)
// prismjsContent = fs.readFileSync(cssCode)
// searchContent = fs.readFileSync(cssSearchForm)
// tablesContent = fs.readFileSync(cssTables)

indexMd5 = md5(indexContent)
// fontsMd5 = md5(fontsContent)
// liteYTMd5 = md5(liteYTContent)
// printMd5 = md5(printContent)
// prismjsMd5 = md5(prismjsContent)
// searchFormMd5 = md5(searchContent)
// tablesMd5 = md5(tablesContent)

console.log(`index MD5 result =`, indexMd5)
// console.log(`fonts MD5 result =`, fontsMd5)
// console.log(`liteYT MD5 result =`, liteYTMd5)
// console.log(`print MD5 result=`, printMd5)
// console.log(`prismjs MD5 result`, prismjsMd5)
// console.log(`search form MD5`, searchFormMd5)
// console.log(`tables MD5`, tablesMd5)

let jsonValue = `{
  "indexCSS": "index-${indexMd5}.css"
}`

fs.writeFileSync(DATAFILE, jsonValue)

let cssTxtValue = `index-${indexMd5}.css`
// let fontsTxtValue = `fonts-${fontsMd5}.css`
// let liteYTTxtValue = `lite-yt-embed-${liteYTMd5}.css`
// let printTxtValue = `print-${printMd5}.css`
// let prismJSTxtValue = `prismjs-${prismjsMd5}.css`
// let searchFormTxtValue = `search-form-${searchFormMd5}.css`
// let tablesTxtValue = `tables-${tablesMd5}.css`
fs.writeFileSync(INDEXFILE, cssTxtValue)
// fs.writeFileSync(FONTSFILE, fontsTxtValue)
// fs.writeFileSync(LITEYTFILE, liteYTTxtValue)
// fs.writeFileSync(PRINTFILE, printTxtValue)
// fs.writeFileSync(CODEFILE, prismJSTxtValue)
// fs.writeFileSync(SEARCHFORMFILE, searchFormTxtValue)
// fs.writeFileSync(TABLESFILE, tablesTxtValue)
