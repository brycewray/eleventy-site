module.exports = function(eleventyConfig) {
  
  eleventyConfig.addShortcode('search', function() {

    return `
    <div class="mr-auto ml-auto">
      <iframe loading="lazy" src="https://duckduckgo.com/search.html?site=brycewray.com&kl=us-en&kn=-1&kf=-1&kx=%230033ff&k8=%23333333&k9=%230000ff&kaa=%230000ff&ka=n&kt=n&prefill=Search this site on DuckDuckGo" style="overflow:hidden;margin:0.5em auto;padding:0;width:330px;height:40px;" frameborder="0" title="DuckDuckGo search form for this site"></iframe>
    </div>
    `

  })
}