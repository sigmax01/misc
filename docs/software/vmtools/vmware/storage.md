---
title: VMWare 存储优化
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 存储优化

## VMWare的磁盘

在某些客户机下, vmware默认选择是SCSI协议/控制器与虚拟磁盘进行沟通, 虚拟磁盘类型(也就是协议)可以选择nvme, 为什么可以同时选择两种不同的协议呢? 这是因为vmware在中间做了一层虚拟, 这种技术叫做nvme over scsi, 也就是说, scsi控制器发送的是scsi协议的控制信号, 经过vmware中间层处理之后转为nvme协议发送nvme协议的控制信号发送给支持nvme的虚拟磁盘. 

流程如下: 

- **SCSI 控制器发送 SCSI 命令**：
    - 在虚拟机内部，操作系统和应用程序会将存储请求发送到虚拟 SCSI 控制器。
    - 虚拟 SCSI 控制器接收这些请求，并生成相应的 SCSI 命令。
- **VMware 处理 SCSI 命令**：
    - VMware 的虚拟化层接收到虚拟 SCSI 控制器发出的 SCSI 命令。
    - 虚拟化层将这些 SCSI 命令解析并翻译成 NVMe 命令。这一步涉及协议转换，确保存储请求能够正确传递到 NVMe 设备。
- **NVMe 协议与存储设备交互**：
    - 转换后的 NVMe 命令被发送到底层的 NVMe 存储设备（如 NVMe SSD）。
    - NVMe 设备处理这些命令，并将结果返回给虚拟化层。
- **返回结果给虚拟机**：
    - 虚拟化层将 NVMe 设备返回的结果再转换回 SCSI 响应。
    - 最终，虚拟 SCSI 控制器将这些响应返回给虚拟机中的操作系统和应用程序

**SCSI 控制器 + NVMe SSD：** 虽然虚拟机通过 SCSI 控制器进行 I/O 操作，但底层的 NVMe SSD 可以提供更高的带宽和更低的延迟，从而整体上提升了虚拟机的存储性能。
一般考虑**SCSI 控制器 + NVMe SSD的组合(如果没有NVMe控制器的话). 
SCSI控制器选择: VMware Paravirtual (PVSCSI)**

这些 SCSI 控制器是虚拟化平台提供的虚拟硬件，虚拟机的操作系统会将其视为真实的硬件设备。

## LVM

LVM的结构由一下的几个概念组成:

- 物理磁盘: 物理上的一块磁盘
- 物理卷(PV): 物理卷是LVM的最底层单位。它通常是一个物理硬盘分区，可以是整块磁盘或分区。每个物理卷上都有一个唯一的LVM标识符，用于识别和管理。
- 卷组(VG): 卷组是由一个或多个物理卷组成的逻辑存储池。可以把卷组看作是一个大的虚拟磁盘。在卷组中，所有的物理卷的存储空间被合并，用户可以从卷组中动态分配存储空间给逻辑卷。
- 逻辑卷(LV): 逻辑卷是从卷组中分配出来的存储空间，类似于传统分区。逻辑卷可以根据需要动态调整大小，而无需重新分区或格式化整个磁盘。逻辑卷可以被格式化为任何文件系统类型，并挂载到系统中。

例子:

```
查看物理磁盘分区情况以及LVM下的结构
$ lsblk
MOUNTPOINTS
loop0                       7:0    0  69.2M  1 loop /snap/core22/1383
loop1                       7:1    0 104.3M  1 loop /snap/docker/2918
loop2                       7:2    0  33.7M  1 loop /snap/snapd/21761
nvme0n1                   259:0    0   100G  0 disk
├─nvme0n1p1               259:1    0   953M  0 part /boot/efi
├─nvme0n1p2               259:2    0   1.8G  0 part /boot
└─nvme0n1p3               259:3    0  97.3G  0 part
  └─ubuntu--vg-ubuntu--lv 252:0    0  97.3G  0 lvm  /
```

- 物理磁盘: nvme0n1
- 物理卷: nvme0n1p3
    
    ```
      pvs查看物理卷简要信息
      $ sudo pvs
      PV             VG        Fmt  Attr PSize   PFree
      /dev/nvme0n1p3 ubuntu-vg lvm2 a--  <97.32g    0
      
      pvdisplay查看物理卷详细信息
      $ sudo pvdisplay
      --- Physical volume ---
      PV Name               /dev/nvme0n1p3
      VG Name               ubuntu-vg
      PV Size               <97.32 GiB / not usable 1.00 MiB
      Allocatable           yes (but full)
      PE Size               4.00 MiB
      Total PE              24913
      Free PE               0
      Allocated PE          24913
      PV UUID               rT435J-G9XO-IiMl-e7T1-AVSJ-jr6d-oggEUV
    ```
    
- 卷组: ubuntu-vg
    
    ```
    vgs查看卷组简要信息
    $ sudo vgs
    VG        #PV #LV #SN Attr   VSize   VFree
    ubuntu-vg   1   1   0 wz--n- <97.32g    0
      
    vgdisplay查看卷组详细信息
    $ sudo vgdisplay
    --- Volume group ---
    VG Name               ubuntu-vg
    System ID
    Format                lvm2
    Metadata Areas        1
    Metadata Sequence No  5
    VG Access             read/write
    VG Status             resizable
    MAX LV                0
    Cur LV                1
    Open LV               1
    Max PV                0
    Cur PV                1
    Act PV                1
    VG Size               <97.32 GiB
    PE Size               4.00 MiB
    Total PE              24913
    Alloc PE / Size       24913 / <97.32 GiB
    Free  PE / Size       0 / 0
    VG UUID               uS3Mzq-HwLm-wRsF-7bD0-41fH-V0pu-Lmw9wt
    ```
    
- 逻辑卷: ubuntu-lv
    
    ```
    lvs查看逻辑卷简要信息
    $ sudo lvs
    LV        VG        Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
    ubuntu-lv ubuntu-vg -wi-ao---- <97.32g
      
    lvdisplay查看逻辑卷详细信息
    $ sudo lvdisplay
    --- Logical volume ---
    LV Path                /dev/ubuntu-vg/ubuntu-lv
    LV Name                ubuntu-lv
    VG Name                ubuntu-vg
    LV UUID                wrVTkm-gyHF-Xhnr-hzOD-qjzS-ZtVa-cC8vQX
    LV Write Access        read/write
    LV Creation host, time ubuntu-server, 2024-07-07 12:43:12 +0000
    LV Status              available
    # open                 1
    LV Size                <97.32 GiB
    Current LE             24913
    Segments               1
    Allocation             inherit
    Read ahead sectors     auto
    - currently set to     256
    Block device           252:0
    ```
    

### 创建一个逻辑卷的完整流程

1. 创建一个物理卷, 这个物理卷可以是物理磁盘下的一个分区或者整块物理磁盘, 这里以创建一个新的物理分区并将这个分区创建为物理卷:
    1. 使用fdisk对物理磁盘创建一个新的分区nvme0n1p4: `sudo fdisk /dev/nvme0n1`
        1. n → 创建新分区
        2. 选择分区号: 4
        3. 起始终止扇区: 默认
        4. w → 写入更改并退出
    2. 创建这个分区为物理卷: `sudo pvcreate /dev/nvme0n1p4`
        
        ```
        $ sudo pvs
        PV             VG        Fmt  Attr PSize   PFree
        /dev/nvme0n1p3 ubuntu-vg lvm2 a--  <97.32g     0
        /dev/nvme0n1p4           lvm2 ---   50.00g 50.00g
        
        $ sudo pvdisplay
        --- Physical volume ---
        PV Name               /dev/nvme0n1p3
        VG Name               ubuntu-vg
        PV Size               <97.32 GiB / not usable 1.00 MiB
        Allocatable           yes (but full)
        PE Size               4.00 MiB
        Total PE              24913
        Free PE               0
        Allocated PE          24913
        PV UUID               rT435J-G9XO-IiMl-e7T1-AVSJ-jr6d-oggEUV
        
        "/dev/nvme0n1p4" is a new physical volume of "50.00 GiB"
        --- NEW Physical volume ---
        PV Name               /dev/nvme0n1p4
        VG Name
        PV Size               50.00 GiB
        Allocatable           NO
        PE Size               0
        Total PE              0
        Free PE               0
        Allocated PE          0
        PV UUID               89zsfH-4IXR-sK3W-NulP-WsMv-dF8G-FbkLxA
        ```
        
        可以看到, 目前为止这个物理卷还没有被加入到任何一个卷组中
        
2. 将物理卷`/nvme0n1p4` 加入到卷组`ubuntu-vg` 中
    
    `sudo vgextend ubuntu-vg /dev/nvme0n1p4`
    
    ```
    $ sudo vgs
    VG        #PV #LV #SN Attr   VSize   VFree
    ubuntu-vg   2   1   0 wz--n- 147.31g <50.00g
    
    $ sudo vgdisplay
    --- Volume group ---
    VG Name               ubuntu-vg
    System ID
    Format                lvm2
    Metadata Areas        2
    Metadata Sequence No  6
    VG Access             read/write
    VG Status             resizable
    MAX LV                0
    Cur LV                1
    Open LV               1
    Max PV                0
    Cur PV                2
    Act PV                2
    VG Size               147.31 GiB
    PE Size               4.00 MiB
    Total PE              37712
    Alloc PE / Size       24913 / <97.32 GiB
    Free  PE / Size       12799 / <50.00 GiB
    VG UUID               uS3Mzq-HwLm-wRsF-7bD0-41fH-V0pu-Lmw9wt
    ```
    
    可以看到`ubuntu-vg` 卷组中的PV数量变为2, VFree增加了50G.
    
3. 可以将所有的空间都分配给现有的逻辑卷`ubuntu-lv`
    
    `sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv`
    
4. 也可以新创建一个逻辑卷, 然后将空闲空间分配给新创建的逻辑卷

### 扩展文件系统大小

分为两步:

1. 扩展磁盘
2. 扩展文件系统

***系统为LLM:***

**扩展磁盘**

1. 在Vmware设置中扩展硬盘大小, 即`nvme0n1`的大小
2. `sudo fdisk /dev/nvme0n1` , 新建一个分区`nvme0n1p4` , 起始扇区和终止扇区默认就可以 (若删除原扇区再新建扇区, 记得对物理卷进行resize: `pvresize` )
3. 将`nvme0n1p4` 添加到`ubuntu-vg` 卷组: `sudo vgextend ubuntu-vg /dev/nvme0n1p4`
4. 这个时候, `ubuntu-vg` 卷组的空间就变大了, 通过`sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv` 将所有`ubuntu-vg` 卷组的空间空间都分配给`ubuntu-lv` 逻辑卷

**扩展文件系统**

当你扩展逻辑卷时, 实际上只是增加了存储空间, 但是文件系统不会自动扩展来使用这些空间, 所以要使用`resize2fs` 之类的工具扩展/缩小文件系统, 使其利用新的空间.

可以使用`sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv` 调整文件系统的大小以适应逻辑卷的新大小.

注意: ⚠️若物理磁盘分区中没有物理卷对应的那个分区, 会报错, 直接无法进系统. 如现在有物理分区`nvme0n1p4` , 并且该物理卷已经注册到了LVM中, 若现在通过`fdisk` 移除这个分区, 则会导致直接无法进系统

***系统不为LLM:***

**扩展磁盘**

1. 在Vmware设置中扩展硬盘大小, 即`nvme0n1`的大小
2. `sudo fdisk /dev/nvme0n1` , 删除当前分区`nvme0n1p3` , 选择保留签名, 创建新的`nvme0n1p3` 

**扩展文件系统**

可以使用`sudo resize2fs /dev/nvme0n1p3` 调整文件系统的大小以适应逻辑卷的新大小.

### 更新fstab

在某些情况下，分区 UUID 可能会发生变化。检查并更新 `/etc/fstab` 文件以确保系统可以正确挂载分区。

1. 找到新的分区 UUID：
    
    ```bash
    sudo blkid /dev/sda1
    ```
    
2. 编辑 `/etc/fstab` 并更新根分区的 UUID。