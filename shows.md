---
layout: page
title: Shows
permalink: /shows/
---

# Upcoming Shows

Coming soon...

# Past Shows

<div class="posts">
  {% for post in site.posts %}
    <article class="post">

      <h1><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h1>

      <div class="entry">
        {{ post.excerpt }}
      </div>
    </article>
  {% endfor %}
</div>
