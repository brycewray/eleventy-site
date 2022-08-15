const childProcess = require('child_process');

module.exports = () => {
  const now = new Date();
  const timeZone = 'America/Chicago';
  const buildTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone,
  }).format(now);

  const latestGitCommitHash =
    childProcess
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

  return {
    time: {
      raw: now.toISOString(),
      formatted: `${buildTime} ${timeZone}`,
    },
    hash: latestGitCommitHash,
  };
};
