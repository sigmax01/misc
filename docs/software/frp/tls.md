---
title: TLS
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# TLS

## 生成服务端证书

1. 生成CA的公钥和私钥
    ```
    openssl genrsa -out /home/wenzexu/man/frp/ca-server.key 2048
    openssl req -x509 -new -nodes -key /home/wenzexu/man/frp/ca-server.key -subj "/CN=example.ca.com" -days 5000 -out /home/wenzexu/man/frp/ca-server.crt
    ```
2. 生成一个服务端的私钥
    ```
    openssl genrsa -out /home/wenzexu/man/frp/server.key 2048
    ```

3. 生成一个CSR数字签名请求
    ```
    openssl req -new -sha256 -key /home/wenzexu/man/frp/server.key \
    -subj "/C=XX/ST=DEFAULT/L=DEFAULT/O=DEFAULT/CN=server.com" \
    -reqexts SAN \
    -config <(cat my-openssl.cnf <(printf "\n[SAN]\nsubjectAltName=DNS:localhost,IP:127.0.0.1,DNS:example.server.com")) \
    -out /home/wenzexu/man/frp/server.csr
    ```

4. 使用CSR向CA发起签名请求, 并返回服务端公钥
    ```
    openssl x509 -req -days 365 -sha256 \
    -in /home/wenzexu/man/frp/server.csr -CA /home/wenzexu/man/frp/ca-server.crt -CAkey /home/wenzexu/man/frp/ca-server.key -CAcreateserial \
    -extfile <(printf "subjectAltName=DNS:localhost,IP:127.0.0.1,DNS:example.server.com") \
    -out /home/wenzexu/man/frp/server.crt
    ```

## 生成客户端证书

1. 生成CA的公钥和私钥
    ```
    openssl genrsa -out /Users/wenzexu/man/frp/ca-server.key 2048
    openssl req -x509 -new -nodes -key /Users/wenzexu/man/frp/ca-server.key -subj "/CN=example.ca.com" -days 5000 -out /Users/wenzexu/man/frp/ca-server.crt
    ```
2. 生成一个客户端的私钥
    ```
    openssl genrsa -out /Users/wenzexu/man/frp/server.key 2048 
    ```
3. 生成一个CSR数字签名请求
    ```
    openssl req -new -sha256 -key /Users/wenzexu/man/frp/server.key \
    -subj "/C=XX/ST=DEFAULT/L=DEFAULT/O=DEFAULT/CN=server.com" \
    -reqexts SAN \
    -config <(cat my-openssl.cnf <(printf "\n[SAN]\nsubjectAltName=DNS:localhost,IP:127.0.0.1,DNS:example.server.com")) \
    -out /Users/wenzexu/man/frp/server.csr 
    ```
4. 使用CSR向CA发起签名请求, 并返回客户端的公钥
    ```
    openssl x509 -req -days 365 -sha256 \
    -in /Users/wenzexu/man/frp/server.csr -CA /Users/wenzexu/man/frp/ca-server.crt -CAkey /Users/wenzexu/man/frp/ca-server.key -CAcreateserial \
    -extfile <(printf "subjectAltName=DNS:localhost,IP:127.0.0.1,DNS:example.server.com") \
    -out /Users/wenzexu/man/frp/server.crt
    ```