---
title: 网络
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 网络

```
network:
  version: 2
  renderer: networkd
  wifis:
    wlp2s0:
      dhcp4: false
      dhcp6: false
      addresses:
        - 192.168.31.99/24
      routes:
        - to: default
          via: 192.168.31.1
      nameservers:
        addresses: [192.168.31.1]
      wakeonlan: true
      access-points:
        "<ssid>":
          password: "<password>"
```