---
title: VMWare 鼠标滚动迟缓
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 鼠标滚动迟缓

## 解决方案

若使用的是X11, 可以尝试修改X11的配置文件. 以Archlinux为例, 在`/etc/X11/xorg.conf.d`下新建配置文件`0-mice.conf`, 输入以下内容:

```
Section "InputDevice"
 
    Identifier "Configured Mouse"
    Driver "vmmouse"
    Option "Protocol" "ImPS/2"
    Option "CorePointer"
    Option "Device" "/dev/input/mice"
    Option "ZAxisMapping" "4 5"
    Option "Emulate3Buttons" "yes"
 
EndSection
```

## 参考资料

https://blog.csdn.net/guoqignrus/article/details/117755322