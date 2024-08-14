---
title: Archlinux 内核安装更换
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 内核安装更换

## 不同版本的内核

Archlinux可能常常会出现滚坏的问题, 问题可能出在内核上. 这里我们可以选择更多的内核, 来替换掉暂时损坏的内核:

- `linux`: 基于上游Linux stable release所编译的版本, 发布时间不确定, 是大部分Archlinux用户的选择, 效能最均衡的核心. 滚动更新, 几乎每个月(每天)都会有新版本
- `linux-lts`: 基于上游Linux LTS release编译的长期支援版本, 提供长时间的安全性更新, 而非一直加新功能. 更新较慢, 适合追求稳定的用户使用
- `linux-zen`: 基于上游Linux stable, 加上一些patch所编译而成的核心, 目的在于加快linux的反应速度, 牺牲一些吞吐量, 让系统看起来比较顺畅, 适合追求极致性能的用户使用
- `linux-hardened`: 基于Linux hardened编译, 追求极致安全, 加上一些增加安全性的patch. 不建议桌面用户使用, 效能下降严重. 

## 切换Archlinux内核

1. 安装需要使用的核心, 记得还要装`*-headers`套件, 有些程序编译要用
    ```bash
    sudo pacman -S linux-lts linux-lts-headers
    ```
2. 更新initramft
    ```bash
    sudo mkinitcpio -p linux-lts
    ```
3. 编辑GRUB设定`sudo vim /etc/default/grub`, 加入以下两行, 使其记住开机时候使用的核心
    ```
    GRUB_DEFAULT=saved
    GRUB_SAVEDEFAULT=true
    ```
4. 更新GRUB设定
    ```
    sudo grub-mkconfig -o /boot/grub/grub.cfg
    ```
5. 重启, 在GRUB界面选取Advanced Options for Arch, 选取`linux-lts`开机

## 启动流程

1. UEFI固件启动: 当你按下电源键之后, UEFI固件开始运行并执行硬件自检和初始化. 完成这些任务后, UEFI会从EFI系统分区(ESP)中寻找可启动的EFI可执行文件. 这个EFI分区通常会被挂载文件系统中的`/efi`或者`/boot/efi`下, 可执行文件如`/efi/EFI/grub/grubx64.efi`
2. 执行GRUB: UEFI固件加载并执行GRUB的EFI可执行文件`grubx64.efi`, GRUB开始运行, 并加载其配置文件, 位于`/boot/grub/grub.cfg`. 注意`/etc/default/grub`是GRUB的全局配置文件, 用于定义实际GRUB配置文件`/boot/grub/grub.cfg`的参数. `/boot/grub/grub.cfg`是GRUB实际使用的配置文件, 用于引导操作系统, 如果你要更改GRUB配置, 应该编辑`/etc/default/grub`, 然后使用命令生成新的`grub.cfg`. 这个配置文件定义了可用的内核选项和其他引导参数, GRUB显示启动菜单, 允许你选择要启动的操作系统和内核版本
3. 加载: 根据在GRUB的选择, GRUB将加载Linux内核和initramfs, 内核开始运行并初始化系统的硬件, 此时, 内核使用initramfs作为临时根文件系统, initramfs会加载必要的系统模块, 驱动程序, (如zfs模块, 内核没有这个模块, 必须要借助initramfs中包含的模块来启动; 如ext4不需要用到initramfs). initramfs会尝试识别并挂载实际的根文件系统, 挂载成功后, initramfs会使用`switch_root`或`pivot_root`命令, 将系统的根文件系统从initramfs切换到实际的根文件系统, 之后, 内核将控制权移交给系统中的`init`进程
4. 启动`init`进程: 通常是`/lib/systemd/systemd`, 这个进程复杂启动系统的服务和守护进程. `systemd`根据配置文件启动所有必要的系统服务, 最终进入多用户模式, 图形界面

