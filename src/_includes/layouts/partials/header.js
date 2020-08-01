const { svgNavIcon } = require( '../../../assets/svg/svgs.js')

module.exports = function(eleventyConfig) {

  eleventyConfig.addShortcode('siteHeader', function() {

    return `
    <header class="h-12 bg-blue-700 w-full fixed p-0 mt-0 z-50">
      <p class="site-logo-holder ml-4 md:ml-8 lg:ml-12 xl:ml-16"><a href="/" aria-label="This site's “BW” logo">${svgNavIcon}</a></span></p>
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-hidden="true" />
      <label for="nav-toggle" class="nav__icon" aria-hidden="true">
        Expand the menu
          <span class="nav__icon-line"></span>
          <span class="nav__icon-line"></span>
          <span class="nav__icon-line"></span>
      </label>
      <nav role="navigation" class="nav">
        <ul class="nav__items">
          <li class="nav__item">
            <a href="/about/" title="About">About</a>
          </li>
          <li class="nav__item">
            <a href="/posts/" title="Posts">Posts</a>
          </li>
        </ul>
      </nav>
    </header>
    `

  })

}