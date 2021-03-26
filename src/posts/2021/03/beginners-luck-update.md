---
layout: layouts/posts/singlepost.11ty.js
tags: post
title: "Beginner’s luck: an update"
subtitle: "New and updated starter sets for Eleventy and Hugo"
description: "The inventory has grown, so here’s what I currently offer for those interested in the two best SSGs."
author: Bryce Wray
date: 2021-03-25T20:25:00-05:00
#lastmod:
discussionId: "2020-07-chasing-100-tips-optimizing-website"
featured_image: susan-holt-simpson-H7SCRwU1aiM-unsplash_4608x3072.jpg
featured_image_width: 4608
featured_image_height: 3072
featured_image_alt: "Colorful toy alphabet blocks"
featured_image_caption: |
  <span class="caption">Image: <a href="https://unsplash.com/@shs521?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Susan Holt Simpson</a>; <a href="https://unsplash.com/s/photos/toy-blocks?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

---

Interested in building a new website with, or converting an existing site to, either of the two best [static site generators](https://jamstack.org/generators) (SSGs)? Please read on, my friend.

Recently, I've been spending spare hours working on [Eleventy](https://11ty.dev) and [Hugo](https://gohugo.io) **starter sets** for folks like you. And they're not only updated versions of the ones I [announced last July](/posts/2020/07/beginners-luck), but also some others of more recent vintage---including **two new ones** I'm announcing today.

Rather than expect you to find them on your own in my various scattered references across my humble little site, I thought I'd write this brief post to list them all together. Maybe you'll find them helpful in whatever you choose to do in Eleventy or Hugo. Each is always based on the current appearance and layout of this site, which I hope will make clearer the connection between the code and the result.

I'll list each by the name of its respective [repository](https://en.wikipedia.org/wiki/Software_repository) ("repo") in [GitHub](https://github.com). I've also linked each to its live demo on [Vercel](https://vercel.com).

## Eleventy starters

Incidentally: the *eleventy_solo* in each Eleventy starter's name comes from that of [**this** site's repo](https://github.com/brycewray/eleventy_solo) (and, if you're wondering why I chose that name, you may want to see my [post from last year](/posts/2020/05/going-solo-eleventy) about when, and why, I converted the site over from Eleventy/[webpack](https://webpack.js.org) to Eleventy-only).

The Eleventy starters are distinguished by two things: which of the [numerous Eleventy **templating choices**](https://www.11ty.dev/docs/languages/) they use, [JavaScript](https://www.11ty.dev/docs/languages/javascript/) or [Nunjucks](https://www.11ty.dev/docs/languages/nunjucks/); and how they're **styled**.

So, here we go.

- [eleventy_solo_starter](https://github.com/brycewray/eleventy_solo_starter)---JavaScript templating; [Tailwind CSS](https://tailwindcss.com). [View the demo](https://eleventy-solo-starter-alpha.vercel.app/).
- [eleventy_solo_starter_njk](https://github.com/brycewray/eleventy_solo_starter_njk)---[Nunjucks](https://mozilla.github.io/nunjucks) templating; Tailwind CSS. [View the demo](https://eleventy-solo-starter-njk.vercel.app/).
- [eleventy_solo_starter_twjit](https://github.com/brycewray/eleventy_solo_starter_twjit)---JavaScript templating; Tailwind CSS with the just-in-time (JIT) compiler (for details about the advantages of this experimental addition to Tailwind, refer to the [official announcement](https://blog.tailwindcss.com/just-in-time-the-next-generation-of-tailwind-css) as well as [my related post](/posts/2021/03/jit-game-changer-tailwind-css/)). [View the demo](https://eleventy-solo-starter-twjit.vercel.app/).
- [eleventy_solo_starter_njk_twjit](https://github.com/brycewray/eleventy_solo_starter_njk_twjit)---Nunjucks templating; Tailwind CSS with the experimental JIT compiler. [View the demo](https://eleventy-solo-starter-njk-twjit.vercel.app/).
- [eleventy_solo_starter_scss](https://github.com/brycewray/eleventy_solo_starter_scss) (**new**)---JavaScript templating; [SCSS](https://sass-lang.com). [View the demo](https://eleventy-solo-starter-scss.vercel.app).
- [eleventy_solo_starter_njk_scss](https://github.com/brycewray/eleventy_solo_starter_njk_scss) (**new**)---Nunjucks templating; SCSS. [View the demo](https://eleventy-solo-starter-njk-scss.vercel.app).

## Hugo starters

For now, I still have only two Hugo starters. This is for two reasons: there's only one form of templating in Hugo (Go-based templating); and the Tailwind JIT compiler isn't yet compatible with Hugo. One is based on Tailwind CSS (again, no JIT) and the other on SCSS. Once the Hugo-*vs.*-JIT issues are resolved, I'll likely add a JIT-equipped Hugo starter, too.

- [hugo_twcss](https://github.com/brycewray/hugo_twcss)---Tailwind CSS. [View the demo](https://hugo-twcss.vercel.app).
- [hugo_solo](https://github.com/brycewray/hugo_solo)---SCSS. [View the demo](https://hugo-solo.vercel.app).

## Enjoy

As usual, I've learned a few things while working on these, including the need to fix some embarrassing oversights in the older ones. Regardless of your proficiency with Eleventy and/or Hugo, perhaps you'll find them similarly educational. Have fun with them.

If you use one of the repos, you'll probably want to "watch" that repo for changes (which have been frequent of late). Also, please [let me know](/contact)---including with [GitHub issues](https://guides.github.com/features/issues/), if you prefer---if you encounter difficulties with any of them.

Happy SSG-ing!