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

## 仓库

```
[repository]
ROOT = /data/git/repositories
DISABLED_REPO_UNITS =  repo.issues,repo.ext_issues,repo.pulls,repo.wiki,repo.ext_wiki
DISABLED_REPO_UNITS = [repo.projects, repo.packages, repo.actions]
DEFAULT_BRANCH = master
ENABLE_PUSH_CREATE_USER: true
DISABLE_DOWNLOAD_SOURCE_ARCHIVES: true
```

## Actions

```
[actions]
ENABLED: false
```

## Packages
```
[packages]
ENABLED: false
```
