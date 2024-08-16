---
title: Archlinux快照
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 快照

::: info
下列命令都在超级管理员角色下运行
:::

## Btrfs

Btrfs是一个写时复制(CoW)的系统, 所以是原生支持快照的. 并且Btrfs驱动已经并入到内核中, 所以非常方便. 创建Btrfs文件系统的命令为`mkfs.btrfs <设备名>`. 也可以使用RAID组建一个存储池, `mkfs.btrfs -m raid0 -d raid0 <设备名1> <设备名2> ...`. `-m`用于指定元数据的RAID级别, `-d`用于指定数据的RAID级别.

### 子卷

子卷类似LVM的逻辑卷(LV), 但它不是块设备, 可以看作是一个独立的目录, 在文件结构中也表现为一个目录, 子卷之间独立互不影响, 任何子卷都可以被挂载到任何位置.

Btrfs文件系统被创立之后, 同时会生成一个顶级子卷, 其`subvolid`为5.

#### 创建子卷

创建子卷之前, 必须先挂载子卷所属的顶级子卷, 因为它本质上是顶级子卷的一个逻辑分区. 挂载命令为`mount -t btrfs /dev/nvme0n1p3 /mnt`, 将文件系统挂载到`/mnt`下, 然后创建子卷`btrfs subvolume create /mnt/@`和`btrfs subvolume create /mnt/@home`. 

::: tip
若文件系统由多个设备构成, 如创建文件系统`mkfs.btrfs -m raid0 -r raid0 <设备名1> <设备名2> ...`, 在挂载的时候, 只需要声明其中的一个设备名就可以了, 如`mount -t btrfs <设备1> /mnt`. 底层逻辑是: Btrfs使用设备UUID来识别和管理每个设备. 当你挂载文件系统的时候, Btrfs会通过设备的UUID来确认哪些设备属于同一个文件系统. 这种改设计使得你只需要提供其中一个设备的名称, Btrfs就能找到并挂载整个文件系统.
:::

#### 挂载子卷

在创建完子卷之后, 就可以挂载子卷了. 我们需要先卸载顶级子卷, 因为顶级子卷现在被挂载在`/mnt`上, 而我们的目标是将子卷`@`挂载到`/mnt`上作为新系统的根目录. 所以需要先卸载顶级子卷`umount /mnt`, 然后挂载子卷`mount -t btrfs -o compress=zstd,subvol=/@ /dev/nvme0n1p3 /mnt`, 然后创建家目录, `mkdir /mnt/home`, 然后挂载子卷`@home`, `mount -t btrfs -o compress=zstd,subvol=@home /dev/nvme0n1p3 /mnt/home`. 最后自动生成`fstab`文件`genfstab -U /mnt >> /mnt/etc/fstab`. 

::: tip
可以看到, 我们使用了`subvol`指定想要挂载的子卷, 我们还可以使用`subvolid`指定想要挂载的子卷, 前者使用子卷ID, 后者使用子卷相对于顶级子卷的路径. 若没有指定`subvol`或者`subvolid`, 则挂载默认子卷, 默认就是顶级子卷, 可以被修改, 如果你修改了默认子卷为其他子卷并还想要挂载顶级子卷, 必须使用顶级子卷的ID, 即5来挂载顶级子卷. 推荐使用子卷ID来挂载子卷, 因为这样即使子卷被移动, 也可以被正确地挂载. 还有一点是, 顶级子卷没有快照功能, 所以永远不要挂载顶级子卷.
:::

挂载之后, 就可以`arch-chroot`过去使用了. 或者直接重启进入新系统.

#### 使用方式

Btrfs中的子卷共用整个文件系统的所有空间, 即你有两个子卷`@`和`@home`, 我们无须担心某个子卷使用空间过大的情况, 因为它们共享同一个空间, 即顶层子卷的空间. 当然, 我们也可以设置配额防止某一个子卷过大. 

子卷的使用方式一般分为嵌套子卷和顶层子卷. 举一个例子就会非常明白了:

在`arch-chroot`之前, 我们创建了两个平行子卷: 

```bash
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
``` 

现在你有两个平行子卷, `@`和`@home`, 它们是彼此独立的, 需要分别挂载:

```bash
mount -t btrfs -o subvol=@ /dev/nvme0n1p3 /mnt
mount -t btrfs -o subvol=@home /dev/nvme0n1p3 /mnt/home
```

这个时候, 我们可以在`@home`子卷的内部创建一个子卷`@vms`:

```bash
btrfs subvolume create /mnt/home/@vms
```

这个`@vms`子卷是不需要挂载的, 因为Btrfs会将当前子卷下面的所有子子卷自动挂载. 

::: tip
这个时候, 如果为`@home`创建快照, 虽然`@home`下嵌套着`@vms`, 但是快照中不会包含`@vms`中的内容, 因为Btrfs的快照功能是基于子卷独立的, 每个子卷的快照只会捕获该子卷当前的状态, 不会自动包含嵌套在其中的其他子卷. 
:::

#### 删除子卷

删除子卷可以使用`btrfs subvolume delete <子卷路径>`命令. 从Linux内核4.18开始, 删除子卷目录也可以删除子卷.

### 写时复制

#### 对文件的写时复制

你可以将文件名视为inode的指针. 在写入文件的时候, Btrfs会拷贝原始inode, 生成一个新的inode. 若原始inode指向数据块`1, 2, 3, 4`, 其中数据块`3`发生了修改, 则新的inode会指向`1, 2, 4, 5`, 其中`5`是经过修改后的数据块, 其他数据块的指向保持不变. 然后将文件名指向新的inode.

#### 对目录的写时复制

目录是一个文件. 所以修改目录中的任何一项都会为这个目录文件创建新的inode, 这会沿着文件系统树递归直到文件系统的根.

所以对于目录或者文件的修改, 都会导致其所有父级目录的inode的变化. 举一个例子, 假设有一个简单的文件系统结构, 如下所示:

```
/
└── dirA/
    ├── file1
    └── file2
```

当修改了file1之后, Btrfs会为file1创建新的inode, 由于dirA中包含file1这个目录项, 所以又为dirA创建一个新的inode, 同理, 为根目录创建一个新的inode. 这是一种递归的过程. 因此, 只要保留对任何旧目录的inode的状态, 并且这些目录没有被删除或者覆写, 就可以通过将文件系统指针指向快照时的inode状态, 就可以随时恢复到之前旧状态的文件系统树, 这就是Btrfs快照. 由于只要保留对旧数据的引用, 所以快照操作非常快, 在几秒之内完成.

::: tip
Btrfs默认对文件目录启用写时复制功能, 也可以禁用, 一般有两种方法:
1. 使用`chattr + C`
    可以使用这个命令对特定文件或者目录禁用写时复制, 这种方法在文件或者目录创建之后设置, 并且仅对未来的写入生效. 
    ::: details
    ```bash
    mkdir /mnt/my_volume/nodirectcow
    chattr +C /mnt/my_volume/nodirectcow
    ```
2. 在挂载时使用`nowdatacow`选项
    可以在挂载Btrfs文件系统的时候使用`nodatacow`挂载选项, 来全局禁用写时复制. 这个文件会影响所有的文件.
    ::: details
    ```bash
    mount -o nodatacow /dev/sdX1 /mnt
    ```
注意, 禁用CoW之后的文件或者目录将无法使用Btrfs快照功能, 因为文件的inode不会被拷贝, 创建快照后, 禁用CoW的文件/目录的inode会被一直更新.
:::

### 透明压缩

Btrfs支持透明和自动数据压缩, 文件写入的时候会自动压缩, 文件读取的时候会自动解压, 此特性以较少的CPU使用率换取较高的空间利用率. 默认不会启用数据压缩, 可以使用`compress`挂载选项启用数据压缩, 还可以更改压缩方式和等级. 

::: tip
在不使用`compress`挂载的情况下, 使用`chattr + c`命令为文件或者目录属性为其启用压缩(注意是小写`c`).
:::

### 快照

在写时复制里面已经提到了, 创建快照非常简单快捷. Btrfs的快照本身也是一个子卷, 只不过是利用了写时复制和引用链接. 

创建快照的命令`btrfs subvolume snapshot @home @home_bak1`, 此命令为`@home`子卷创建了一个名为`@home_bak1`的快照. `@home_bak1`是一个本身就可以使用的子卷, 所以需要回滚的话, 只需要挂载对应的快照子卷`@home_bak1`, 或者将原子卷`@home`删掉, 重命名快照子卷`@home_bak1`为`@home`. 注意! 这样做的前提是挂载选项中使用的是`subvol`, 而不是`subvolid`, 因为`@home_bak1`和`@home`的子卷ID是不一样的, 所以使用`subvolid`会导致无法挂载, 或者也可以使用Live CD `arch-chroot`后查看新的子卷的ID, 然后修改`fstab`文件.

::: warning
切换根文件系统的子卷之后要更新GRUB配置. 因为GRUB在加载内核镜像之后, 会读取`/boot/default/grub.cfg`中的信息, 并将根文件系统位置的参数(如`root=`, `subvol=`)传递给initramfs, 然后据此挂载根文件系统. 那么为什么切换用户目录的子卷之后不需要更新GRUB配置呢? 这是因为initramfs只负责根目录(系统目录)的挂载, 用户目录的挂载是根目录挂载成功后, 由`systemd`根据`/etc/fstab`中的配置来完成的.

不需要更新initramfs, initramfs是在添加了新的硬件需要在启动的时候加载驱动或者更换根文件系统类型(如zfs, raid)需要额外的内核模块支持的时候更新. 
:::

### 注意点

- 虽然Btrfs子卷在挂载的时候看起来是不同的挂载项, 但是在Linux内核看来, 它们其实上指向的是同一个分区的. 这意味着当你挂载第一个子卷的时候, 大多数挂载选项会影响到所有关联的挂载项
- 若你修改了默认子卷, 需要在顶级子卷下创建新的子卷的时候, 需要先挂载顶级子卷, 然后在顶级子卷挂载点下创建子卷
- Btrfs由于种种特性, 某些分区统计工具可能无法精确统计, 需要获取分区的精确使用情况, 可以使用`btrfs filesystem usage <子卷挂载路径>`来查看具体信息