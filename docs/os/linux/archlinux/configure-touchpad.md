---
title: 配置触控板 
layout: doc
navbar: true
sidebar: false
aside: false
outline: 2
lastUpdated: false
editLink: false
footer: true
---

# 配置触控板

## 环境

KDE(X11) + libinput + Archlinux.

::: warning
其他环境未经测试, 不知道是否可以正常启用.
:::

## 配置

默认状态下自然滚动是`disabled`, 需要开启. 编辑`/etc/X11/xorg.conf.d/40-libinput.conf`文件, 写入以下内容:

```
Section "InputClass"
    Identifier "touchpad"
    Driver "libinput"
    MatchIsTouchpad "on"
    Option "NaturalScrolling" "true"
EndSection
```

## 参考资料

https://wiki.archlinuxcn.org/wiki/Libinput