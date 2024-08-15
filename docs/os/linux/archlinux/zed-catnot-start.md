---
title: Archlinux Zed编辑器无法启动问题
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# Zed编辑器无法启动问题

使用命令`curl -f https://zed.dev/install.sh | sh`安装Zed后, 发现无法启动. 

## 解决方案

[https://github.com/zed-industries/zed/issues/13441#issuecomment-2215489926](https://github.com/zed-industries/zed/issues/13441#issuecomment-2215489926), 我是用的也是AMD的GPU, 安装`vulkan-radeon`包: `sudo pacman -S vulkan-radeon`.