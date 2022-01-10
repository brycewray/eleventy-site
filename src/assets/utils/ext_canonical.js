module.exports = (ext_canonical) => {
var extCanonical = `
<p class="blueBox"><strong>Note</strong>: This article originally appeared on the <a href="${ext_canonical}" target="_blank">Stackbit blog</a> and includes edits (content-related and stylistic) by the Stackbit staff.</p>`
return extCanonical
}

// The HTML above is escaped properly only if white space is *not* used, hence the lack of indentation above. For more details, see https://github.com/11ty/eleventy/issues/180.
