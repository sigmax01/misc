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

### 准备

```bash
useradd -mG docker -s /bin/bash -d /home/wenzexu wenzexu
su wenzexu
docker network create --subnet=172.18.0.0/24 app
```

### SSL证书

请见[这里](/software/frp/tls#生成服务端证书).

### `man.yaml`文件

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
      - /home/wenzexu/man/frp/ssl/ca-client.crt:/etc/frp/ssl/ca-client.crt:ro
      - /home/wenzexu/man/frp/ssl/server.crt:/etc/frp/ssl/server.crt:ro
      - /home/wenzexu/man/frp/ssl/server.key:/etc/frp/ssl/server.key:ro
    ports:
      - 5440:5440
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
      - "7750:7750"
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

### `frps.toml`文件

```toml
bindAddr = "0.0.0.0"
bindPort = 5440
auth.token = "<请填入token>"
transport.tls.force = true
transport.tls.certFile = "/etc/frp/ssl/server.crt"
transport.tls.keyFile = "/etc/frp/ssl/server.key"
transport.tls.trustedCaFile = "/etc/frp/ssl/ca-client.crt"
allowPorts = [
  {start = 60000, end = 65535}
]
```

## 客户端

目前客户端主要用的是Mac Mini.

### 准备

```
docker network create --subnet=172.18.0.0/24 app
```

### SSL证书

请见[这里](/software/frp/tls#生成客户端证书).

### `man.yaml`文件

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
      - /Users/wenzexu/man/frp/ssl/ca-server.crt:/etc/frp/ssl/ca-server.crt:ro
      - /Users/wenzexu/man/frp/ssl/client.crt:/etc/frp/ssl/client.crt:ro
      - /Users/wenzexu/man/frp/ssl/client.key:/etc/frp/ssl/client.key:ro

networks:
  app:
    external: true
```

### `frpc.toml`文件

```toml
serverAddr = "<请填入地址>"
serverPort = 5440
auth.token = "<请填入token>"
transport.protocol = "websocket"
transport.tls.enable = true
transport.tls.certFile = "/etc/frp/ssl/client.crt"
transport.tls.keyFile = "/etc/frp/ssl/client.key"
transport.tls.trustedCaFile = "/etc/frp/ssl/ca-server.crt"

[[proxies]]
name = "alist"
type = "tcp"
localIP = "alist"
localPort = 5244
remotePort = 60001
transport.useEncryption = true # 启用tls+额外加密
```