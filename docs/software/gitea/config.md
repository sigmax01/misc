---
title: 常用配置
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 常用配置

## admin

admin就是第一次登录的时候创建的用户.

::: tip
可以通过修改`app.ini`文件的`[service]`项的`DISABLE_REGISTRATION`禁用注册.
:::

## 主页

可以通过修改`app.ini`文件的`[server]`项的`LANDIING_PAGE`修改默认主页.

## SSH

请在`app.ini`文件中定义`SSH_PORT`为映射在主机上的SSH端口, 如22; 而`SSH_LISTEN_PORT`为内置SSH的端口, 应该设置为`22`.

## 克隆

## 克隆法

## 克隆法

关闭Https克隆:

```
[repository]
DISABLE_HTTP_GIT = true
```