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

## Https

https://docs.gitea.com/administration/https-setup, 这里通过`gitea cert --host [HOST]`自签证书.

```
[server]
PROTOCOL  = https
ROOT_URL  = https://git.example.com:3000/
HTTP_PORT = 3000
CERT_FILE = cert.pem
KEY_FILE  = key.pem
```

## service

```
[service]
DISABLE_REGISTRATION = true
SHOW_REGISTRATION_BUTTON = false
SHOW_MILESTONES_DASHBOARD_PAGE = false
```

### service.explore

```
[service.explore]
DISABLE_USERS_PAGE = true
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
DISABLED_REPO_UNITS = repo.projects, repo.packages, repo.actions
DEFAULT_BRANCH = master
DEFAULT_REPO_UNITS = repo.code, repo.releases, repo.issues, repo.pulls, repo.wiki
ENABLE_PUSH_CREATE_USER: true
DISABLE_DOWNLOAD_SOURCE_ARCHIVES: true
DISABLE_HTTP_GIT = true
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
