---
title: VMWare 磁盘格式切换
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 磁盘格式切换

## 推荐方案

推荐方案就是不切换, 在安装的时候就选择好特定的格式.

在安装的时候, 可以选择高级安装, 然后指定”立即分配所有磁盘空间”, 这样创建的是类似于raw格式的磁盘.

## 不推荐方案

或者你在安装完成之后, 如果想要切换, 可以使用一个命令行工具(windows/linux), macos直接在硬盘设置里勾选”pre-allocate diskspace”就从growable转为pre-allocated, 取消勾选, 就是pre-allocated转为growable(需要删除所有快照).

以windows为例: 

```powershell
cd "C:\Program Files (x86)\VMware\VMware Workstation"
.\vmware-vdiskmanager.exe -r "c:\path\to\source.vmdk" -t <数字见上表> "c:\path\to\target.vmdk"
.\vmware-vdiskmanager.exe -r "D:\VM\Ubuntu 24.04 64位\Ubuntu 64.vmdk" -t 2 "D:\VM\Ubuntu 24.04 64位\Ubuntu-preallocated.vmdk"
```

**注意, vmdk文件名中不能含有中文.**

## 参考资料

- [https://www.virtuatopia.com/index.php?title=How_to_Convert_a_VMware_Pre-allocated_Virtual_Disk_to_a_Growable_Virtual_Disk](https://www.virtuatopia.com/index.php?title=How_to_Convert_a_VMware_Pre-allocated_Virtual_Disk_to_a_Growable_Virtual_Disk)
- [https://www.howtogeek.com/313125/how-to-convert-between-preallocated-and-growable-disks-in-vmware/](https://www.howtogeek.com/313125/how-to-convert-between-preallocated-and-growable-disks-in-vmware/)