---
title: 安装
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 安装

1. 确保app桥接网络已经创建.
2. 将下列代码保存为`docker-compose.yaml`文件, 放在`/root`下, `docker compose up -d`
  ```
  ---
  # 请先确保app桥接网络已经创建

  services:

    nginx-proxy-manager:
        image: 'jc21/nginx-proxy-manager:latest'
        restart: always
        ports:
          - '80:80'
          - '443:443'
          # - '81:81'
        volumes:
          - /root/nginx/data:/data
          - /root/nginx/letsencrypt:/etc/letsencrypt
        networks:
          - app
          
    portainer: # 9443 HTTPS 9000 HTTP
      image: portainer/portainer-ce:latest
      volumes:
        - /root/portainer:/data
        - /var/run/docker.sock:/var/run/docker.sock
      restart: always
      networks:
        - app

  networks:

    app:
      external: true
  ```