---
layout: singlepost
title: "Reply-to links in site feeds"
subtitle: "A follow-up to “Help your website get discovered”"
description: "Thanks to a reader’s helpful advice, here’s how to enhance the code for your site’s RSS and JSON feeds."
author: Bryce Wray
date: 2021-09-09T14:40:00-05:00
#lastmod:
discussionId: "2021-09-reply-to-links-feeds"
featured_image: "magnifying-glass-4490044_4288x2848.jpg"
featured_image_width: 4288
featured_image_height: 2848
featured_image_alt: "Monochrome photo of magnifying glass resting on an opened spiral notebook"
featured_image_caption: |
  <span class="caption">Image: <a href="https://pixabay.com/users/kaosnoff-9039104/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4490044">Vitor Dutra Kaosnoff</a>; <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4490044">Pixabay</a></span>
---

Back in May, in "[Help your website get discovered](/posts/2021/05/help-your-website-get-discovered)," I provided code you could use to add RSS and JSON feeds to an [Eleventy](https://11ty.dev) site. Then, [more recently](/posts/2021/07/gems-in-rough-07/#comment-by-email), I added the "Reply via email" link to the bottom of each post. However, combining the two---*i.e.*, making sure there was a "Reply via email" link in each entry in the respective feeds---hadn't occurred to me until a few days ago, when a reader suggested it to me and provided a link to his own article, "[Email Replies in Feeds](https://blog.jim-nielsen.com/2020/email-replies-in-rss/)," explaining how he'd done it in the [Metalsmith](https://metalsmith.io/) [static site generator](https://jamstack.org/generators) (SSG). Accordingly, I updated my feeds-related code to incorporate this capability.

Before I give you the updated code, here's a TL;DR explanation of the changes I made. The [Eleventy RSS plugin](https://www.11ty.dev/docs/plugins/rss/) provides a variable called `item.templateContent` which grabs a post's content. Since my per-post reply-via-email link falls **outside** the content's boundaries, I created a separate variable, `emailReplyHTML`, to hold the HTML for that link, concatenated the two variables into `finalHTMLContent`, and then injected `finalHTMLContent` rather than `item.templateContent` into the appropriate `content` tag in each feed.

*(One more thing: that original article also provided code for RSS and JSON feeds in the [Hugo](https://gohugo.io) SSG but, as yet, I've been unable to incorporate these changes successfully into the JSON feed code for Hugo. I have asked on the Hugo community forum for help with this and, if/when I receive it, I'll update this post accordingly.)*

Now, on to the code&nbsp;.&nbsp;.&nbsp;.

### RSS

{% raw %}

```twig
---json
{
  "permalink": "/index.xml",
  "eleventyExcludeFromCollections": true,
  "metadata": {
    "title": "BryceWray.com",
    "subtitle": "brycewray.com — Observations, opinions, geekery.",
    "description": "brycewray.com — Observations, opinions, geekery.",
    "url": "https://www.brycewray.com/",
    "feedUrl": "https://www.brycewray.com/index.xml",
    "authors": {
      "name": "Bryce Wray",
      "url": "https://www.brycewray.com/about/"
    }
  }
}
---
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
	<title>{{ metadata.title }}</title>
	<subtitle>{{ metadata.subtitle }}</subtitle>
	<link href="{{ metadata.feedUrl }}" rel="self"/>
	<link href="{{ metadata.url }}"/>
	<updated>{{ collections.all | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
	<id>{{ metadata.url }}</id>
	<author>
		<name>{{ metadata.authors.name }}</name>
	</author>
	{%- for item in collections.all | reverse -%}
		{%- if loop.index0 < 10 -%}
			{%- set absolutePostUrl -%}{{ item.url | url | absoluteUrl(metadata.url) }}{%- endset -%}
      {%- set emailReplyHTML -%}<p><a href="mailto:bw@brycewray.com?subject=Re: “{{ item.data.title }}”">Reply via email</a></p>{%- endset -%}
      {%- set finalHTMLContent = [item.templateContent, emailReplyHTML] | join -%}
			<entry>
				<title>{{ item.data.title }}</title>
				<link href="{{ absolutePostUrl }}"/>
				<updated>{{ item.date | dateToRfc3339 }}</updated>
				<id>{{ absolutePostUrl }}</id>
				<summary>{%- if item.data.subtitle -%}{{ item.data.subtitle }}{%- else -%}""{%- endif -%}{%- if item.data.description %} • {{ item.data.description }}{%- else -%}"[No description]"{%- endif -%}</summary>
				<content type="html">
          {{ finalHTMLContent | htmlToAbsoluteUrls(absolutePostUrl) }}
        </content>
			</entry>
		{%- endif -%}
	{%- endfor %}
</feed>
```

{% endraw %}

### JSON

{% raw %}

```twig
---json
{
  "permalink": "/index.json",
  "eleventyExcludeFromCollections": true,
  "metadata": {
    "title": "BryceWray.com",
    "description": "brycewray.com — Observations, opinions, geekery.",
    "url": "https://www.brycewray.com/",
    "feedUrl": "https://www.brycewray.com/index.json",
    "authors": {
      "name": "Bryce Wray",
      "url": "https://www.brycewray.com/about/"
    }
  }
}
---
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "{{ metadata.title }}",
  "home_page_url": "{{ metadata.url }}",
  "feed_url": "{{ metadata.feedUrl }}",
  "description": "{{ metadata.description }}",
  "items": [
    {%- for item in collections.all | reverse -%}
      {%- if loop.index0 < 10  -%}
        {%- set absolutePostUrl -%}{{ item.url | url | absoluteUrl(metadata.url) }}{%- endset -%}
        {%- set emailReplyHTML -%}<p><a href="mailto:bw@brycewray.com?subject=Re: “{{ item.data.title }}”">Reply via email</a></p>{%- endset -%}
        {%- set finalHTMLContent = [item.templateContent, emailReplyHTML] | join -%}
        {
          "id": "{{ absolutePostUrl }}",
          "title": "{{ item.data.title }}",
          "url": "{{ absolutePostUrl }}",
          "date_published": "{{ item.date | dateFromRFC2822 }}",
          "summary": "{% if item.data.subtitle -%}{{ item.data.subtitle }} • {% endif -%}{%- if item.data.description -%}{{ item.data.description }}{%- else -%}No description{%- endif %}",
          "content_html": {{ finalHTMLContent | htmlToAbsoluteUrls(absolutePostUrl) | dump | safe }}
        }{%- if not loop.last -%},{%- endif %}
      {%- endif -%}
    {%- endfor %}
  ]
}
```

{% endraw %}

**Note**: Of course, if you're already a subscriber to either of my feeds (and, if so, thank you!), you won't see the resulting "Reply via email" link in content that had been pulled into your chosen newsreader app before I implemented these code changes. The only way to see it in older content would be to flush the old posts and then reload them.
{.yellowBox}
