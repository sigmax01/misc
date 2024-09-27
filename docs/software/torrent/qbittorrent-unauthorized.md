---
title: qBittorrent管理页面显示unauthorized
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# qBittorrent管理页面显示unauthorized

1. 停止容器
2. 编辑`qBittorrent.conf`
3. 添加:
    ```
    WebUI\HostHeaderValidation=false
    WebUI\CSRFProtection=false
    ```
4. 启动容器
5. 默认用户密码: `docker logs qbittorrent`