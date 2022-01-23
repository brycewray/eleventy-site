const today = new Date()
const currentYear = today.getFullYear()

module.exports = (ext_canonical) => {
  var extCanonicalText = `
<p class="blueBox"><strong>Note</strong>: This article originally appeared on the <a href="${ext_canonical}" target="_blank">Stackbit blog</a> and is &copy;&nbsp;${currentYear}&nbsp;<a href="https://www.stackbit.com" target="_blank">Stackbit</a>. The&nbsp;article includes external edits (content-related and stylistic) for that&nbsp;site.</p>`
return extCanonicalText
}

// The HTML above is escaped properly only if white space is *not* used, hence the lack of indentation above. For more details, see https://github.com/11ty/eleventy/issues/180.
