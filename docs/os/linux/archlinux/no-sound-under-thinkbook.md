---
title: Thinkbook下没有声音问题 
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# Thinkbook下没有声音问题

电脑型号: Thinkbook 16 G6 IRL. 安装Archlinux后没有声音.

## 解决方案 

编辑`/etc/default/grub`文件, 在`GRUB_CMDLINE_LINUX_DEFAULT`变量中添加参数`snd_hda_intel.dmic_detect=0`, 然后重新生成GRUB的配置文件`sudo grub-mkconfig -o /boot/grub/grub.cfg`. 重启.

## 参考资料

https://bbs.archlinux.org/viewtopic.php?pid=2008885#p2008885