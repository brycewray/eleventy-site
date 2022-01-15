module.exports = (text, user, tweet, date) => {
  return `
<div class="twitter-tweet"><p>${text}<br /><span class="legal"><a href="https://twitter.com/${user}/status/${tweet}" target="_blank" rel="nofollow">@${user} &bull; ${date}</a></span></p></div>
`
}

// The HTML above is escaped properly only if white space is *not* used, hence the lack of indentation above. For more details, see https://github.com/11ty/eleventy/issues/180.
