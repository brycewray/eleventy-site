module.exports = (ext_canonical) => {
var extCanonical = `
<p class="blueBox"><strong>Note</strong>: This article originally appeared on the <a href="${ext_canonical}" target="_blank">Slackbit blog</a>.</p>`
return extCanonical
}

// The HTML above is escaped properly only if white space is *not* used, hence the lack of indentation above. For more details, see https://github.com/11ty/eleventy/issues/180.
