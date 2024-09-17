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

```
docker network create --subnet=172.18.0.0/24 app
```

## 服务端

```bash
useradd -mG docker -s /bin/bash -d /home/wenzexu wenzexu
```

```yaml
---

services:
  frps:
    image: snowdreamtech/frps
    container_name: frps
    hostname: frps
    restart: always
    networks:
      - app
    volumes:
      - /home/wenzexu/man/frp/frps.toml:/etc/frp/frps.toml:ro
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    hostname: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: always
    networks:
      - app
  nginx-proxy-manager:
    container_name: npm
    hostname: npm
    image: "jc21/nginx-proxy-manager:latest"
    restart: always
    ports:
      - "80:80"
      - "443:443"
      # - '81:81'
    volumes:
      - /home/wenzexu/man/nginx/data:/data
      - /home/wenzexu/man/nginx/letsencrypt:/etc/letsencrypt
    networks:
      - app

networks:
  app:
    external: true
```

```toml
bindAddr = "127.0.0.1"
bindPort = 7790
auth.token = ""
transport.tls.force = true
transport.tls.certFile = ""
transport.tls.keyFile = ""
transport.tls.trustedCaFile = ""
allowPorts = [
  {start = 60000, end = 65535}
]
```

## 客户端

```yaml
---

services:
  frpc:
    image: snowdreamtech/frpc
    container_name: frpc
    hostname: frpc
    restart: always
    networks:
      - app
    volumes:
      - /Users/wenzexu/man/frp/frpc.toml:/etc/frp/frpc.toml:ro
      - /U

networks:
  app:
    external: true
```

```toml
serverAddr = ""
serverPort = 7790
auth.token = ""
transport.tls.enable = true
transport.tls.certFile = ""
transport.tls.keyFile = ""
transport.tls.trustedCaFile = ""

[[proxies]]
name = "alist"
type = "tcp"
localIP = "alist"
localPort = 
remotePort = 60001
transport.useEncryption = true # 启用tls+额外加密
```