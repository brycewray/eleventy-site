module.exports = (ext_canonical) => {
var extCanonical = `
<p class="blueBox"><strong>Note</strong>: This article originally appeared on the <a href="${ext_canonical}" target="_blank">Stackbit blog</a> and includes external edits (content-related and stylistic) for that&nbsp;site.</p>`
return extCanonical
}

// The HTML above is escaped properly only if white space is *not* used, hence the lack of indentation above. For more details, see https://github.com/11ty/eleventy/issues/180.
