---
title: 配置
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 配置

创建一个新的"空数据库".

```bash
mkdir -p /Volumes/SSD/app/filebrowser/config
touch /Volumes/SSD/app/filebrowser/config/filebrowser.db
```

编辑配置文件`vi /Volumes/SSD/app/filebrowser/config/.filebrowser.json`.

```json
{
  "port": 80,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/filebrowser.db",
  "root": "/srv"
}
```

docker compose.

```
filebrowser: # 80
    image: filebrowser/filebrowser:latest
    container_name: filebrowser
    hostname: filebrowser
    restart: unless-stopped
    ports:
      - 5555:80
    networks:
      - net2
    volumes:
      - /Volumes/SSD/media:/srv
      - type: bind
        source: /Volumes/SSD/app/filebrowser/config/filebrowser.db
        target: /filebrowser.db
      - type: bind
        source: /Volumes/SSD/app/filebrowser/config/.filebrowser.json
        target: /.filebrowser.json
```