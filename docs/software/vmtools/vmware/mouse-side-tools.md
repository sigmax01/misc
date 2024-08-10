---
title: VMWare 鼠标侧边按键
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 启用侧边鼠标按键

VMWare默认无法使用logi鼠标的侧边栏按键.

## 解决方案

编辑虚拟机的vmx配置文件.

```
# 添加下列配置
mouse.vusb.enable = "TRUE"
mouse.vusb.useBasicMouse = "FALSE"
# 下边这行一般已经设置, 如果没有设置, 加上
usb.generic.allowHID = "TRUE"
```