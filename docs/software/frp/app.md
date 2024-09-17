---
title: APP
layout: doc
navbar: true
sidebar: false
aside: false
outline: 2
lastUpdated: false
editLink: false
footer: true
next: false
prev: false
---

# APP

```yaml
---
# 请先确保app桥接网络已经创建
# 请确保将PUID, PGID改成wenzexu的

services:
  stirling-pdf: # 8080
    image: frooodle/s-pdf:latest
    container_name: stirling-pdf
    hostname: stirling-pdf
    volumes:
      - /Users/wenzexu/app/stirling-pdf/trainingData:/usr/share/tessdata
      - /Users/wenzexu/app/stirling-pdf/extraConfigs:/configs
    environment:
      - DOCKER_ENABLE_SECURITY=true
      - INSTALL_BOOK_AND_ADVANCED_HTML_OPS=false
      - LANGS=zh_CN
      - SECURITY_ENABLE_LOGIN=true
    restart: unless-stopped
    networks:
      - app
  it-tools: # 80
    image: corentinth/it-tools
    restart: unless-stopped
    container_name: it-tools
    hostname: it-tools
    networks:
      - app
  alist: # 5244
    container_name: alist
    hostname: alist
    image: 'xhofe/alist:latest'
    restart: unless-stopped
    volumes:
      - /Users/wenzexu/app/alist:/opt/alist/data
    environment:
      - PUID=501
      - PGID=501
      - UMASK=022
    networks:
      - app

networks:
  app:
    external: true
```