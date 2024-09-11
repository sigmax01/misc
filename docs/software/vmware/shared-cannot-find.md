---
title: 无法找到共享文件夹
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 无法找到共享文件夹

VMWare开启共享文件夹后并未挂载.

## 解决方案

- Open a root shell in the VM
- Make sure the /mnt/hgfs directory exists. If not, create it.
- Add the following line to /etc/fstab: `vmhgfs-fuse /mnt/hgfs fuse defaults,allow_other,_netdev 0 0`
- Then reboot your VM. The shared folders should now appear at the mount point /mnt/hgfs