---
title: cloudfront配合nginx反向代理
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# cloudfront配合nginx反向代理

在搭建个人导航页的时候, 我发现了cloudfront配合nginx反向代理会出问题. 报502错误. 这是因为在客户端请求ricolxwz.de的时候, cloudfront服务器没有将原始请求的host, 即主机名修改为ricolxwz-origin.de, 而nginx是根据主机名进行分流的, 它一看, 收到的主机名是ricolxwz.de, 没有和这个匹配的反代服务, 就返回404, 即原站错误了. 

## 解决方法

源请求策略修改为: "AllViewerExceptHostHeader", 表示不会改写为ricolxwz.de.

## 参考资料

https://blog.csdn.net/weixin_42445065/article/details/130113760