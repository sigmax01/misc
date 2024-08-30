---
title: DDNS
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# DDNS

在Custom Codes for Dashboard添加配置: 

```
DDNS:
  Enable: true
  MaxRetries: 3
  Profiles:
    common:
      Provider: "cloudflare"
      AccessSecret: "<你的Cloudflare密钥>"
```

然后在添加服务器的时候, 选择启用DDNS, 启用DDNS IPv4, IPv6, DDNS域名填写指向的域名, DDNS配置填写`common`