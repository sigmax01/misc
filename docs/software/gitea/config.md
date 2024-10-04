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

## service

```
[service]
DISABLE_REGISTRATION = true
```

## server

```
[server]
SSH_PORT = 22
SSH_LISTEN_PORT = 22
LANDING_PAGE = explore
```

## repository

```
[repository]
ROOT = /data/git/repositories
DISABLED_REPO_UNITS =  repo.issues,repo.ext_issues,repo.pulls,repo.wiki,repo.ext_wiki
DISABLED_REPO_UNITS = [repo.projects, repo.packages, repo.actions]
DEFAULT_BRANCH = master
ENABLE_PUSH_CREATE_USER: true
DISABLE_DOWNLOAD_SOURCE_ARCHIVES: true
```

## actions

```
[actions]
ENABLED: false
```

## packages
```
[packages]
ENABLED: false
```
