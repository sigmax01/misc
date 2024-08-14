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
3. 加载: 根据在GRUB的选择, GRUB将加载Linux内核和initramfs, 内核开始运行并初始化系统的硬件, 此时, 内核使用initramfs作为临时根文件系统, initramfs会加载必要的系统模块, 驱动程序, (如zfs模块, 内核没有这个模块, 必须要借助initramfs中包含的模块来启动; 如ext4不需要用到initramfs; 若根文件系统位于LVM逻辑卷, 加密卷, 或者RAID阵列上, 也需要initramfs中的相应模块). initramfs会尝试识别并挂载实际的根文件系统, 挂载成功后, initramfs会使用`switch_root`或`pivot_root`命令, 将系统的根文件系统从initramfs切换到实际的根文件系统, 之后, 内核将控制权移交给系统中的`init`进程
    ::: tip
    `mkinitcpio`提供了一种模块化的方式来创建initramfs. 通过配置文件`/etc/mkinitcpio.conf`, 用户可以选择哪些模块和钩子应该包含在initramfs中
    ::: details 当前Archlinux的`mkinitcpio`文件
    ```
    # vim:set ft=sh
    # MODULES
    # The following modules are loaded before any boot hooks are
    # run.  Advanced users may wish to specify all system modules
    # in this array.  For instance:
    #     MODULES=(usbhid xhci_hcd)
    MODULES=()

    # BINARIES
    # This setting includes any additional binaries a given user may
    # wish into the CPIO image.  This is run last, so it may be used to
    # override the actual binaries included by a given hook
    # BINARIES are dependency parsed, so you may safely ignore libraries
    BINARIES=()

    # FILES
    # This setting is similar to BINARIES above, however, files are added
    # as-is and are not parsed in any way.  This is useful for config files.
    FILES=()

    # HOOKS
    # This is the most important setting in this file.  The HOOKS control the
    # modules and scripts added to the image, and what happens at boot time.
    # Order is important, and it is recommended that you do not change the
    # order in which HOOKS are added.  Run 'mkinitcpio -H <hook name>' for
    # help on a given hook.
    # 'base' is _required_ unless you know precisely what you are doing.
    # 'udev' is _required_ in order to automatically load modules
    # 'filesystems' is _required_ unless you specify your fs modules in MODULES
    # Examples:
    ##   This setup specifies all modules in the MODULES setting above.
    ##   No RAID, lvm2, or encrypted root is needed.
    #    HOOKS=(base)
    #
    ##   This setup will autodetect all modules for your system and should
    ##   work as a sane default
    #    HOOKS=(base udev autodetect modconf block filesystems fsck)
    #
    ##   This setup will generate a 'full' image which supports most systems.
    ##   No autodetection is done.
    #    HOOKS=(base udev modconf block filesystems fsck)
    #
    ##   This setup assembles a mdadm array with an encrypted root file system.
    ##   Note: See 'mkinitcpio -H mdadm_udev' for more information on RAID devices.
    #    HOOKS=(base udev modconf keyboard keymap consolefont block mdadm_udev encrypt filesystems fsck)
    #
    ##   This setup loads an lvm2 volume group.
    #    HOOKS=(base udev modconf block lvm2 filesystems fsck)
    #
    ##   This will create a systemd based initramfs which loads an encrypted root filesystem.
    #    HOOKS=(base systemd autodetect modconf kms keyboard sd-vconsole sd-encrypt block filesystems fsck)
    #
    ##   NOTE: If you have /usr on a separate partition, you MUST include the
    #    usr and fsck hooks.
    HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)

    # COMPRESSION
    # Use this to compress the initramfs image. By default, zstd compression
    # is used for Linux ≥ 5.9 and gzip compression is used for Linux < 5.9.
    # Use 'cat' to create an uncompressed image.
    #COMPRESSION="zstd"
    #COMPRESSION="gzip"
    #COMPRESSION="bzip2"
    #COMPRESSION="lzma"
    #COMPRESSION="xz"
    #COMPRESSION="lzop"
    #COMPRESSION="lz4"

    # COMPRESSION_OPTIONS
    # Additional options for the compressor
    #COMPRESSION_OPTIONS=()

    # MODULES_DECOMPRESS
    # Decompress loadable kernel modules and their firmware during initramfs
    # creation. Switch (yes/no).
    # Enable to allow further decreasing image size when using high compression
    # (e.g. xz -9e or zstd --long --ultra -22) at the expense of increased RAM usage
    # at early boot.
    # Note that any compressed files will be placed in the uncompressed early CPIO
    # to avoid double compression.
    #MODULES_DECOMPRESS="no"
    ```
    :::
4. 启动`init`进程: 通常是`/lib/systemd/systemd`, 这个进程复杂启动系统的服务和守护进程. `systemd`根据配置文件启动所有必要的系统服务, 最终进入多用户模式, 图形界面

## 一些软件包

- `linux-firmware`: 这个包包含了许多硬件设备所需的固件文件固件是安装在硬件设备上的软件, 用于控制设备的运行没有这些固件, 某些硬件设备可能无法在Linux系统上正常工作
- `linux-headers`: 这个包包含了Linux内核的头文件这些头文件对于开发一些依赖于内核功能的程序非常重要, 特别是那些需要直接与内核交互的驱动程序和模块
- `base`: 这个包组包含了一个最小的Arch Linux安装所需要的基本软件包它包括了一些必需的工具和库, 如bash, coreutils, filesystem, glibc等, 这些是系统最基本的运行环境
- `base-devel`: 这个包组包含了一系列开发工具, 这些工具主要用于编译和构建软件例如, 它包括了gcc(C语言编译器)、make(自动化构建工具)和其他一些用于软件开发的实用工具