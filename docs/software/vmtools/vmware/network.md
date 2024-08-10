---
title: VMWare 网络优化
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 网络优化

## 启用万兆网卡

编辑虚拟机的vmx文件, 找到`ethernet0.virtualDev` , 将其值改为`vmxnet3` , 该虚拟网卡的速率可到到万兆, 注意需要虚拟机关机之后修改, 启动之后网卡名称会发生变化, 即时更新netplan中的文件.

Fusion编辑vmx文件: [https://knowledge.broadcom.com/external/article/330654/editing-the-vmx-file-for-your-vmware-fus.html](https://knowledge.broadcom.com/external/article/330654/editing-the-vmx-file-for-your-vmware-fus.html)

## 查看网络命令

- 查看pci设备: `lspci` 
- 查看网卡速率: `ethtool [网卡名称]`, `lshw -C network`

## 设置网络网段

### 设置VMware Fusion的网络网段

1. 第一种方法: 修改默认NAT配置中的网段
    https://knowledge.broadcom.com/external/article/311759/modifying-the-dhcp-settings-of-vmnet1-an.html
2. 第二种方法: 新建自定义配置, 类型为NAT, 自定义网段(推荐):
    全局设置 → Network → 点击加号自定义配置

### 设置VMware Workstation Pro的网络网段

在编辑 → 虚拟网络编辑器中设置

## 三种网络模式

### 桥接模式

虚拟机获得和主机同一网络中的ip地址, 就像直接连接到物理网络一样.

虚拟机可以访问外网, 外网也可以访问虚拟机上的服务.

### NAT模式

虚拟机可以通过主机的网络访问外部网络, 虚拟机会获得一个内部网络的ip地址, 所有的外部流量通过主机的NAT服务进行转发, 默认DHCP服务分配的主机的ip地址为192.168.91.1, 默认NAT网关的地址为192.168.91.2.

虚拟机可以访问外网, 但是外网无法访问虚拟机上的服务.

将主机适配器连接到当前网络的作用: virtualbox的nat默认模式下是不会将宿主机连接到子网络的, 它不像vmware会在主机上创建一个连接到子网的vmnet8虚拟网卡. vmware的nat模式中有一个选项”将主机虚拟适配器(默认vmnet8)连接到此网络是默认勾选的, 所以可以从宿主机上直接通过ssh连接子网中的vm; 但是virtualbox默认情况下宿主机没法ssh vm, 因为virtualbox不会创建主机虚拟适配器, 没法连接到这个子网. 

### 仅主机模式

虚拟机只能和主机通信, 不能访问外部网络. 只能访问内部网络, 网关就是主机的ip, 默认是192.168.65.1.