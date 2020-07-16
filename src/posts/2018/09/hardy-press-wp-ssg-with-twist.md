---
layout: layouts/posts/singlepostherofit.11ty.js
tags: post
title: "HardyPress: WP + SSG with a twist"
subtitle: Trying to have the best of two worlds
description: Here’s a brief look at an interesting way to have your WordPress cake and eat your SSG site, too—or something like that.
author: Bryce Wray
date: 2018-09-15T13:28:17
lastmod: 2019-04-27T18:45:00
discussionId: "2018-09-hardy-press-wp-ssg-with-twist"
featured_image: wordpress-macbook-pro-923188_5472x3648.jpg
featured_image_alt: WordPress administrative interface in use on a laptop computer
featured_image_caption: "Image: Pixabay"
---

While researching the static-site generator (SSG) scene for the first time in a while yesterday, I happened upon  [HardyPress](https://www.hardypress.com).

It's an interesting proposition: it takes the whole WordPress-to-SSG idea one step further. HardyPress keeps your WordPress install on a hidden location where you edit to your heart's delight, and only **then** does the content get on the web---but as *static* files. So you get the advantage of ease-of-use in WordPress and the security of SSG.

In addition, they host it on a CDN that, as nearly as I can tell, uses Amazon to hit 30 edge servers worldwide. They even provide SSL certs so you can avoid the nasty red blot on Chrome, Firefox, and other HTTPS-savvy browsers.
