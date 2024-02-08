import fs from 'fs'
import fg from 'fast-glob'
import path from 'path'
import md5 from 'md5'
const DATAFILE = './_data/csshash.json'
const CSSFILE = 'hash-css'
const CSSDIR = './src/_includes/css'

if(!fs.existsSync(CSSDIR)) {
  fs.mkdirSync(CSSDIR)
}

let files = {}
fg.sync("./src/assets/css/**/*.css").forEach(function(file) {
	const baseName = path.basename(file, ".css"),
		fileName = `${baseName}.css`
	const output = fs.readFileSync(file)
	const content = output.toString("utf8")
	const hash = md5(content)
	const hashedFileName = `${baseName}-${hash}.css`
	files[fileName] = hashedFileName
	fs.writeFileSync(`${CSSDIR}/${hashedFileName}`, content)
})
let arrayToString = JSON.stringify(files)
fs.writeFileSync(DATAFILE, arrayToString)
// return filesArray
