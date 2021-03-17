// based on lloyd.js in Reuben Lillie's code
// (https://gitlab.com/reubenlillie/reubenlillie.com/)

var headTag = require('./layouts/partials/head') // head.js
var siteHeader = require('./layouts/partials/header') // etc. ...
var siteFooter = require('./layouts/partials/footer')

module.exports = function(eleventyConfig) {

  headTag(eleventyConfig)
  siteHeader(eleventyConfig)
  siteFooter(eleventyConfig)

  return
  
}