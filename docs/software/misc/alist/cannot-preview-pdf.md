---
title: 无法预览pdf
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 无法预览pdf

使用PDF.js打开文件之后, 会出现`Message: Failed to fetch`的错误, 应该是PDF.js本身的错误.

## 解决方案

将预览中的pdf项改为谷歌的预览器即可, 换成: 

```
"Google":"https://docs.google.com/gview?url=$e_url&embedded=true"
```

## 参考资料

https://github.com/alist-org/alist/discussions/2181#discussioncomment-5137807