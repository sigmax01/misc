---
title: 自签证书
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 自签证书

1. `openssl req -x509 -newkey rsa:4096 -keyout ./privkey.pem -out cert.pem -nodes -subj '/CN=localhost'`
2. `openssl pkcs12 -export -out jellyfin.pfx -inkey privkey.pem -in /usr/local/etc/letsencrypt/live/domain.org/cert.pem -passout pass:`