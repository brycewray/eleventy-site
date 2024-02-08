// https://www.aleksandrhovhannisyan.com/blog/eleventy-build-info/
// https://stackoverflow.com/questions/8611486/how-to-get-the-last-commit-date-for-a-bunch-of-files-in-git

// import spawn from 'cross-spawn'
import { DateTime } from "luxon"
import childProcess from 'child_process';
const environment = process.env.NODE_ENV

export default (pubdate, filename) => {

	let stringToRet = ``

	if (environment === "production") {

		let repoLink = `https://github.com/brycewray/eleventy-site/commit/`

		pubdate = DateTime.fromJSDate(pubdate, { zone: 'America/Chicago' }).toFormat("yyyy-MM-dd")

		const lastUpdatedFromGit =
			childProcess
			.execSync(`git log -1 --format=%cd --date=short ${filename}`)
			.toString()
			.trim()

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

		if (longHash !== '') {
			stringToRet = `Latest commit: <a class="font-mono" href="${repoLink}" rel="noopener">${abbrevHash}</a>`
			if (pubdate !== lastUpdatedFromGit) {
				stringToRet += `, ${lastUpdatedFromGit}`
			}
		} else {
			stringToRet = `&nbsp;`
		}

	} else {
		stringToRet = `[Git info will appear here in production.]`
	}

	return stringToRet
}
