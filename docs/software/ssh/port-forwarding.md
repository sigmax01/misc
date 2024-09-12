---
title: 端口转发
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 端口转发

## 本地端口转发

用于将发往本地端口的请求转发到远程的端口.

```
ssh -L localhost:8080:localhost:9000 username@ip
```

表示将发往本地`localhost:8080`的端口的请求转发到远程`localhost:9000`上.

## 远程端口转发

用于将发往远程端口的请求转发到本地的端口.

```
ssh -R localhost:8080:localhost:9000 username@ip
```

表示将发往远程的`localhost:8080`端口的请求转发到本地`localhost:9000`端口上.

注意, 可以定义远程的ip为`0.0.0.0`已提供公网访问能力, 要做到这一点, 要打开SSH配置文件中的`GatewayPorts`选项, 若设置为`no`, 远程的ip只能绑定为`127.0.0.1`, 若设置为`yes`, 端口绑定到`0.0.0.0`, 允许从外网访问这个端口, 若设置为`clientspecified`, 允许客户端指定端口的绑定地址, 如`ssh -R 0.0.0.0:8080:localhost:9000`, 可以从外网访问`<服务器ip>:8080`, 请求会转发到我的电脑的`9000`端口.