---
title: 配置触控板 
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 配置触控板

## 环境

KDE(X11/Wayland) + libinput + Archlinux.

::: warning
其他环境未经测试, 不知道是否可以正常启用.
:::

## 配置

### 方法一

适用于Wayland.

在终端输入`kcmshell6 kcm_touchpad`, 然后选择正确的设备(非常关键), 然后就可以设置各种选项.

### 方法二

适用于X11.

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