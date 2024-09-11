---
title: 内嵌视频
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 内嵌视频

## Bilibili

```html
<div style="position: relative; padding: 30% 45%;">
<iframe style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" src="//player.bilibili.com/player.html?isOutside=true&aid=936042727&bvid=BV16T4y1y7qj&cid=494397114&p=1&high_quality=1&autoplay=false&muted=false&t=185&as_wide=1" frameborder="yes" scrolling="no" allowfullscreen="true"></iframe>
</div>
```

## Youtube

```html
<div class="youtube-video-container">
<iframe class="youtube-video" src="https://www.youtube-nocookie.com/embed/320szM1pUp0?si=vl-K8T0TRQdwUX8b" frameborder="yes" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
```

```css
.youtube-video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
.youtube-video {
  width: 100%;
  height: 100%;
}
```