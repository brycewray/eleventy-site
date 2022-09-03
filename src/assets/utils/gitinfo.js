// https://www.aleksandrhovhannisyan.com/blog/eleventy-build-info/
// https://stackoverflow.com/questions/8611486/how-to-get-the-last-commit-date-for-a-bunch-of-files-in-git

// const spawn = require('cross-spawn')
const childProcess = require('child_process');

module.exports = (pubdate, filename) => {

	let stringtoRet = ``

	let repoLink = `https://github.com/brycewray/eleventy_site/commit/`

	const lastUpdatedFromGit =
		childProcess
		.execSync(`git log -1 --format=%cd --date=short ${filename}`)

  const abbrevHash =
    childProcess
    .execSync(`git log -1 --pretty=format:"%h" ${filename}`)
    .toString()
    .trim()

	const longHash =
	childProcess
		.execSync(`git log -1 --pretty=format:"%H" ${filename}`)
		.toString()
		.trim()

	repoLink += longHash

	stringtoRet = `Latest commit: <a class="mono" href="${repoLink}" rel="noopener">${abbrevHash}</a>`

	if (pubdate !== lastUpdatedFromGit) {
		stringtoRet += `, ${lastUpdatedFromGit}`
	}

	return stringtoRet
}
