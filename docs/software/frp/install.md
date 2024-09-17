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

## 服务端

```bash
useradd -mG docker -s /bin/bash -d /home/wenzexu wenzexu
su wenzexu
docker network create --subnet=172.18.0.0/24 app
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
      - /home/wenzexu/man/frp/ca-client.crt:/etc/frp/ca-client.crt:ro
      - /home/wenzexu/man/frp/server.crt:/etc/frp/server.crt:ro
      - /home/wenzexu/man/frp/server.key:/etc/frp/server.key:ro
    ports:
      - 7790:7790
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
auth.token = "<请填入token>"
transport.tls.force = true
transport.tls.certFile = "/etc/frp/server.crt"
transport.tls.keyFile = "/etc/frp/server.key"
transport.tls.trustedCaFile = "/etc/frp/ca-client.crt"
allowPorts = [
  {start = 60000, end = 65535}
]
```

## 客户端

```
docker network create --subnet=172.18.0.0/24 app
```

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
      - /Users/wenzexu/man/frp/ca-server.crt:/etc/frp/ca-server.crt:ro
      - /Users/wenzexu/man/frp/client.crt:/etc/frp/client.crt:ro
      - /Users/wenzexu/man/frp/client.key:/etc/frp/client.key:ro

networks:
  app:
    external: true
```

```
---
# 请先确保app桥接网络已经创建
# 请确保将PUID, PGID改成wenzexu的

services:
  alist: # 5244
    container_name: alist
    hostname: alist
    image: 'xhofe/alist:latest'
    restart: unless-stopped
    volumes:
      - /Users/wenzexu/app/alist:/opt/alist/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
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

```toml
serverAddr = "<请填入地址>" # 请使用DNS名称
serverPort = 7790
auth.token = "<请填入token>"
transport.tls.enable = true
transport.tls.certFile = "/etc/frp/client.crt"
transport.tls.keyFile = "/etc/frp/client.key"
transport.tls.trustedCaFile = "/etc/frp/ca-server.crt"

[[proxies]]
name = "alist"
type = "tcp"
localIP = "alist"
localPort = 5244
remotePort = 60001
transport.useEncryption = true # 启用tls+额外加密
```