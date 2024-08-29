---
title: Nginx反代小服务
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# Nginx反代小服务

```
user http;
worker_processes auto;
worker_cpu_affinity auto;
events {
        worker_connections 768;
        # multi_accept on;
}
http {
server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name <domain>;
        ssl_certificate       /home/wenzexu/ssl/cert.crt;
        ssl_certificate_key   /home/wenzexu/ssl/private.key;
        ssl_session_timeout 1d;
        ssl_session_cache shared:MozSSL:10m;
        ssl_session_tickets off;
        ssl_protocols         TLSv1.2 TLSv1.3;
        ssl_ciphers           ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        location <path> {
                proxy_pass http://127.0.0.1:<port>; 
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
}
server {
        listen 80;
        server_name <domain>;
        rewrite ^(.*)$ https://${server_name}$1 permanent;
}
}
```