---
title: Archlinux X86安装
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# X86安装

## LiveCD系统上操作

### 禁用reflector服务

```bash
systemctl stop reflector.service
```

### 确认是否处于UEFI模式

```bash
ls /sys/firmware/efi/efivars
```

### 连接无线网络

```bash
iwctl
device list
station wlan0 scan
station wlan0 get-networks
station wlan0 connect wifi-name
exit
ping www.bilibili.com
```

### 更新时钟

```bash
timedatectl set-ntp true
timedatectl status
```

### 分区

```bash
lsblk
parted /dev/nvme0n1
mktable gpt
mkpart EFI 0% 800MB
mkpart SWAP 800MB 16GB
mkpart PRI 16GB 100%
print
quit
fdisk -l
```

### 格式化

```bash
mkfs.vfat /dev/nvme0n1p1
mkswap /dev/nvme0n1p2
mkfs.xfs /dev/nvme0n1p3
# mkfs.ext4 /dev/nvme0n1p3
# mkfs.btrfs /dev/nvme0n1p3
```

### 挂载

#### Ext4/XFS

```bash
mount /dev/nvme0n1p3 /mnt
mkdir /mnt/efi
mount /dev/nvme0n1p1 /mnt/efi
swapon /dev/nvme0n1p2
df -h
```

#### Btrfs

```bash
# 为了创建子卷, 必须先挂载子卷所属的顶级子卷
mount -t btrfs /dev/nvme0n1p3 /mnt
# 创建子卷
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
# btrfs subvolume create /mnt/@snapshots
# 由于顶级子卷占据着/mnt目录, 所以需要先卸载才能挂载@子卷到/mnt
umount /mnt
# 将子卷@挂载到/mnt上
mount -t btrfs -o subvol=/@,compress=zstd,noatime /dev/nvme0n1p3 /mnt
# 将子卷@home挂载到/mnt/home上
mkdir /mnt/home
mount -t btrfs -o subvol=/@home,compress=zstd,noatime /dev/nvme0n1p3 /mnt/home
# 将子卷@snapshots挂载到/mnt/.snapshots上
# mkdir /mnt/.snapshots
# mount -t btrfs -o subvol=/@snapshots /dev/nvme0n1p3 /mnt/.snapshots
# 将顶级子卷(默认子卷ID为5)挂载到/mnt/.btrfsroot上, 方便从文件系统查看顶级子卷情况
mkdir /mnt/.btrfsroot
mount -t btrfs -o ro,subvolid=5,noatime /dev/nvme0n1p3 /mnt/.btrfsroot
# 将/dev/nvme0n1p1挂载到/mnt/efi上
mkdir /mnt/efi
mount /dev/nvme0n1p1 /mnt/efi
# 挂载交换分区
swapon /dev/nvme0n1p2
df -h
```

### 更新keyring

```bash
pacman -Sy
pacman -S archlinux-keyring
```

### 系统安装

```bash
pacstrap /mnt base base-devel linux linux-headers linux-firmware
pacstrap /mnt networkmanager dhcpcd iwd vi vim sudo bash-completion
# 如果使用了timeshift
pacstrap /mnt btrfs-progs
```

### 生成fstab

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

### chroot

```bash
arch-chroot /mnt
```

## chroot后的系统上操作

### 设置主机名

```bash
echo "vmware-archlinux" > /etc/hostname
```

### 设置hosts文件

```bash
echo "127.0.0.1   localhost
::1         localhost
127.0.1.1   myarch" > /etc/hosts
```

### 设置root密码

```bash
passwd root
```

### 设置时区

```bash
ln -sf /usr/share/zoneinfo/Australia/Sydney /etc/localtime
```

###  硬件时间设置

```bash
hwclock --systohc
```

### 安装微码

根据芯片类型选择安装微码.

```bash
pacman -S intel-ucode
pacman -S amd-ucode
```

### 安装引导程序

```bash
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=GRUB
vim /etc/default/grub
# 1. 去掉 GRUB_CMDLINE_LINUX_DEFAULT 一行中最后的 quiet 参数
# 2. 把 loglevel 的数值从 3 改成 5。这样是为了后续如果出现系统错误，方便排错
# 3. 加入 nowatchdog 参数，这可以显著提高开关机速度
grub-mkconfig -o /boot/grub/grub.cfg
```

### 退出

```bash
exit
umount -R /mnt
reboot
```

## 重启后的系统上操作

### 测试网络

```bash
systemctl enable --now NetworkManager
# systemctl enable --now dhcpcd
curl cip.cc
```

### 创建用户

```bash
useradd -m -G wheel -s /bin/bash wenzexu
```

### 设置用户密码

```bash
passwd wenzexu
```

### 开启32位库支持

```bash
vim /etc/pacman.conf
# 去掉[multilib]一节中的注释
pacman -Syyu
```

### 修改fstab文件(若要使用Btrfs, Timeshift)

修改`/mnt/etc/fstab`文件, 在子卷的挂载选项中, 除了顶层子卷即`subvolid=5`保留之外, 将其他的所有`subvolid=<value>`的键值对都删去, 只剩下`subvol=<path>`, 这是因为Timeshift不会在回滚后自动更新`subvolid`, 会导致直接无法启动, 具体请见[这里](/os/linux/archlinux/snapshots#timeshift不会自动更新子卷id).

### 安装KDE

```bash
pacman -S plasma-meta konsole dolphin # 基本包
# plasma-meta 元软件包、konsole 终端模拟器和 dolphin 文件管理器
pacman -S  plasma-workspace # 若还需要wayland支持, 安装这些包
# N卡用户需要额外安装egl-wayland,xdg-desktop-portal包是为了如obs此类工具录制屏幕使用
# xdg-desktop-portal包组提供了不同环境下使用的软件包
# 例如kde用户可选择xdg-desktop-portal-kde包
```

### 安装Gnome

```bash
pacman -S gnome
```

### 配置启动sddm

```bash
systemctl enable --now sddm # KDE
systemctl enable --now gdm # Gnome
```

## 进入图形操作界面后的系统上操作

### 切换到root

```bash
su
```

### 将当前用户添加到sudoers

```bash
cd /etc
chmod 600 sudoers
echo "wenzexu ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
chmod 400 sudoers
```

### 安装VMware工具(可选)

```bash
pacman -S open-vm-tools
systemctl enable vmtoolsd
systemctl enable vmware-vmblock-fuse
pacman -S gtkmm3
reboot
```

### 执行自动化安装程序

检查必须在用户wenzexu下运行.

```bash
cd ~
sudo pacman -S --needed --noconfirm wget
wget -O setup.sh "https://raw.githubusercontent.com/ricolxwz/awesome-scripts/master/arch/setup.sh"
chmod a+x setup.sh
./setup.sh
```

### 启用蓝牙

```bash
sudo systemctl enable --now bluetooth
```

### 电源管理方案

```bash
sudo pacman -S power-profiles-daemon
```

### 安装Pipewire

```bash
sudo pacman -S pipewire-pulse pipewire-alsa pipewire-jack
```