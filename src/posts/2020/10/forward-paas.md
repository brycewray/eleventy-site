---
layout: layouts/posts/singlepostherofit.njk
tags: post
title: "Forward PaaS"
subtitle: "Trying Cloudflare Workers and KV storage"
description: "How I’m testing the waters on an up-and-coming platform-as-a-service (PaaS) offering."
author: Bryce Wray
date: 2020-10-11T18:20:00
lastmod: 2020-12-05T14:50:00
#draft: true
discussionId: "2020-10-forward-paas"
featured_image: jj-ying-8bghKxNU1j0-unsplash_4032x3024.jpg
featured_image_width: 4032
featured_image_height: 3024
featured_image_alt: "Photo concept of high-bandwidth computer networking: Strands of glowing cables representing fiber-optical cables"
featured_image_caption: |
  <span class="caption">Image: <a href="https://unsplash.com/@jjying?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">JJ Ying</a>; <a href="https://unsplash.com/s/photos/network?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
---

It will come as no surprise to my regular readers that I like New Shiny, especially where this little old website is concerned. Well, I’ve succumbed again, for at least a test drive of an interesting [platform as a service (PaaS)](https://en.wikipedia.org/wiki/Platform_as_a_service) offering from [Cloudflare](https://cloudflare.com).

## Workers sites and Workers KV

{% lazypicture "Cloudflare_Workers_scrshot_2020-10-20_2526x1440.png", "Screen capture of Cloudflare Workers web page", 2526, 1440 %}

[Cloudflare Workers](https://workers.cloudflare.com/) have been around [since 2017](https://blog.cloudflare.com/introducing-cloudflare-workers/). They allow developers to put code at the “edge” of Cloudflare’s worldwide [reverse-proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/) [content delivery network (CDN)](https://en.wikipedia.org/wiki/Content_delivery_network), letting users worldwide see faster results since it puts the content “closer” to those users.

A year later, Cloudflare [introduced Workers KV](https://blog.cloudflare.com/introducing-workers-kv/) (the *KV* stands for *key-value*), a way of providing *storage*, mainly for databases as well as code, out on the “edge.” Then, last year, as explained in a [blog post by Rita Kozlov](https://blog.cloudflare.com/workers-sites/), Cloudflare began pushing this setup as a way to put static websites online, [using the Workers KV “edge” storage to host such sites’ files](https://blog.cloudflare.com/extending-the-workers-platform/).

It’s important to note that, while a Cloudflare Worker is free, using KV to store your website files [costs at least $5/month for a Workers Unlimited Plan](https://workers.cloudflare.com/#plans).[^1] By “at least,” I mean you have to stay within certain bandwidth limits. Your site almost certainly wouldn’t exceed them but, still, it’s something to keep in mind.

**Update, 2020-12-05**: In a [blog post](https://blog.cloudflare.com/workers-kv-free-tier/) issued on November 16, 2020, Cloudflare announced a new free tier for KV storage. I was initially concerned that it might come up short compared to the Workers Unlimited Plan because the former still lacked a key performance capability---specifically, lower first-hit latency---that's included with the latter. However, I subsequently tested the free tier, and the results suggest the difference is negligible for a static site like this one, so I *think* that shouldn't be a problem, after all. In addition: just for messing around with a Workers site so you can see how it all works before you go all-in, the free plan is a great new option. {.yellowBox}

With the three hosts I described in “[A normal person’s guide to static website hosting](/posts/2020/09/normal-persons-guide-static-website-hosting),” deploying content is as simple and quick as pushing a commit to your chosen online repository. With Cloudflare Workers, you have to use Cloudflare’s `wrangler` command-line interface (CLI) tools (which I’d compare favorably to [Firebase](https://firebase.google.com)’s CLI tools). I’m currently mitigating this through a [GitHub Action](https://github.com/features/actions),  an approach similar to what I described in “[O say can you CI/CD?](/posts/2020/06/o-say-can-you-ci-cd)” and “[Ignition sequence start](/posts/2020/09/ignition-sequence-start)”; but none of this is for normal, non-nerdy folks.

(For those who care: the GitHub Action is at the end of this post. In fact, I provided two: one for the [Hugo](https://gohugo.io) static site generator (SSG), and one for the [Eleventy](https://11ty.dev) SSG.)

There’s another minor issue, but it’s also fairly easily resolved although it took me several days to find the answer, eventually with help from two extremely kind gentlemen. (Thanks again, [Kenton Varda](https://stackoverflow.com/users/2686899/kenton-varda) and [Brian Li](https://brianli.com/)!) Here’s the deal: if you put a *regular* site behind Cloudflare, the service automatically caches the usual static assets (in my site’s case, CSS and font files, since [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/dqunpyaeqiizezj6lbdu) [handles nearly all of the images](/posts/2020/07/transformed)) so they’ll load faster after the first time. But, [with a Cloudflare Workers site, it doesn’t work that way *by default*](https://stackoverflow.com/questions/64254291/cache-control-headers-in-a-cloudflare-workers-site), so you have to add a little JavaScript to make it happen.[^2] Again, it’s not for non-nerds, at least not right now.

## Stay tuned

Since I wasn’t quite sure upfront how this would work for me, I bought only one month of the Workers Unbundled plan; so we’ll see in a few weeks whether I stick with this or move the site back to one of the other hosts I’ve used. At this writing, the performance numbers I’m seeing are impressive.

---- 

## Appendix: CFW + KV GHAs—OK?

As promised above, here are the GitHub Actions for publishing the site, whether built by Hugo or by Eleventy, to my Cloudflare Worker and its KV storage. You’ll find no great difference between them and the GitHub Actions I put in “[Ignition sequence start](/posts/2020/09/ignition-sequence-start)” for publishing to Firebase—with the possible exception of the fact that I’m using a [Cloudflare-created GitHub Action](https://github.com/cloudflare/wrangler-action) to handle the `wrangler` stuff. Of course, the value of `secrets.CF_API_TOKEN` is stored in the repo’s **Secrets** settings in GitHub.

### For Hugo

{% raw %}
```yaml
name: CI-Hugo-site-to-Cloudflare-Workers

on:
  push:
    branches:
      - main

env:
  HUGO_VERSION: 0.76.5 #steps below will pick extended version

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Checkout default branch
        uses: actions/checkout@v2
      - name: Download Hugo v${{ env.HUGO_VERSION }} Linux x64
        run: "wget https://github.com/gohugoio/hugo/releases/download/v${{ env.HUGO_VERSION }}/hugo_extended_${{ env.HUGO_VERSION }}_Linux-64bit.deb -O hugo_extended_${{ env.HUGO_VERSION }}_Linux-64bit.deb"
      - name: Install Hugo
        run: sudo dpkg -i hugo*.deb
      - name: Install dependencies
        run: npm install
      - name: Build site with Hugo
        run: npm run build
      - name: Publish
        uses: cloudflare/wrangler-action@1.3.0
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          # Other args should come from wrangler.toml and what's in ./workers-site/
```
{% endraw %}


### For Eleventy

{% raw %}

```yaml
name: CI-Eleventy-site-to-Cloudflare-Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Checkout default branch
        uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with: 
          node-version: '12.x'
      - name: Install dependencies
        run: npm install
      - name: Build content
        run: npm run build
      - name: Publish
        uses: cloudflare/wrangler-action@1.3.0
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          # Other args should come from wrangler.toml and what's in ./workers-site/
```

{% endraw %}

[^1]:	The alternative would be to have a *conventionally* stored “bucket” on, say, Google Cloud Platform or Amazon S3—but *that’s* not truly free, either. And, even then, I suspect accessing content stored in that fashion and putting it out on the “edge” would be slower than the edge-*based* KV storage.

[^2]:	This goes into the `index.js` file that the `wrangler` tool “reads” during each build of the site.