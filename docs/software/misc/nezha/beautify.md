---
title: 主题美化
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 主题美化

## 默认主题修改LOGO, 修改页脚

```html
<style>
.right.menu>a {
  visibility: hidden;
}
.footer .is-size-7 {
  visibility: hidden;
}
.item img {
  visibility: hidden;
}
</style>
<script>
window.onload = function() {
  var avatar = document.querySelector(".item img");
  var footer = document.querySelector("div.is-size-7");
  footer.innerHTML = "由麦旋风超好吃驱动 🚜 2024";
  footer.style.visibility = "visible";
  avatar.src = "https://img.ricolxwz.io/favicon-w-ffffff-doc.svg";
  avatar.style.visibility = "visible";
}
</script>
```