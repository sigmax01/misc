---
title: Https
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# Https

## 自签证书

```
mkdir -p /root/ssl
openssl req -x509 -newkey rsa:4096 -keyout /root/ssl/portainer_private.key -out /root/ssl/portainer_cert.crt -days 365 -sha256 -nodes
```

1. 国家: CN
2. 省份: ZJ
3. 城市: SX
4. 公司名称: MC
5. Unit名称: 01
6. Common名称: WZ
7. 邮件: ricol.xwz@outlook.com

## 设置

1. 下载刚才生成的证书和私钥到你的电脑上
2. 在设置-General-SLL certificate, 选择force https only, 然后上传证书和密钥, 点击save, 重新刷新页面, 访问9443端口


## 修改密码

可以通过`<你的ip>:9443`登录, 重新登录后请尽快修改密码. 

## 配置NPM

之后, 可以在NPM容器里面设置将`xxx.example.com`映射到`<你的ip>:9943`. 之后就可以用`xxx.example.com`访问了.