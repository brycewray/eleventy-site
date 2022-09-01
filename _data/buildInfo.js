// https://www.aleksandrhovhannisyan.com/blog/eleventy-build-info/

const childProcess = require('child_process');
const { DateTime } = require("luxon")

module.exports = () => {
  const now = new Date();
  // const timeZone = 'America/Chicago';
  // const buildTime = new Intl.DateTimeFormat('en-US', {
  //   dateStyle: 'full',
  //   timeStyle: 'short',
  //   timeZone,
  // }).format(now);

  const latestGitCommitHash =
    childProcess
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

	let commitTime = DateTime.fromJSDate(now, { zone: 'America/Chicago' }).toFormat("yyyy-MM-dd h:mm:ss a (ZZZZ)")

  return {
    time: {
      raw: now.toISOString(),
      // formatted: `${buildTime} ${timeZone}`,
			formatted: `${commitTime}`
    },
    hash: latestGitCommitHash,
  };
};
