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

```