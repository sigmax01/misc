---
title: 限制IP登录
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 限制IP登录

编辑`/etc/hosts.deny`文件:

```
sshd: ALL
```

编辑`/etc/hosts.allow`文件:

```
sshd: <允许的ip1>, <允许的ip2>
```