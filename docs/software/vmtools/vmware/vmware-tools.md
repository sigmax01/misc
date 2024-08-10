---
title: VMWare Tools
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# VMWare Tools

若VMware Tools的安装图标是灰色的。这是因为VMware会自动检测CD镜像文件中的VMware Tools安装包，检测不到时就会显现灰色无法安装。这时候可以尝试关闭虚拟机, 将虚拟机设置中的CD/DVD、CD/DVD2和软盘三个选项均设置为自动检测。重启虚拟机，灰色的字就被点亮。VMware会自动虚拟一个光盘出来，里面是Vmware tools的软件。同时底部会弹出一个提示，告诉用户VMware Tools怎么安装。看到这个提示说明光盘加载成功。打开VMware Tools的路径，将里面的内容复制到别的目录下。将tar包解压缩，[使用下面的指令安装vmware-install.p](http://xn--vmware-install-uc7vh9hi9cdt1gf03a709e37foz6iii6c.pl/)l: 

```
sudo perl vmware-install.pl
```

安装时会可以根据提示进行自定义配置，这里我都直接回车default了。安装成功后，首先可以看到虚拟机全屏显示了！

若上述方法不行, 可以尝试使用VMware Tools的开源版本: 

open-vm-tools 是 VMware Tools 的开源实施，由一套虚拟化实用程序组成，这些程序可增强虚拟机在 VMware 环境中的功能，使管理更加有效。open-vm-tools 的主要目的是使操作系统供应商及/或社区以及虚拟设备供应商将 VMware Tools 绑定到其产品发布中。

从Ubuntu14.04开始open-vm-tools 代替了官方 VMware Tools

如果想装open-vm-tools，一定要先删除VMware Tools，否则两者会冲突。卸载程序是tar包解压缩后的/bin目录下的vmware-uninstall-tools.pl: 

```
sudo vmware-uninstall-tools.pl
```

安装新的open-vm-tools-desktop。这里注意，有图形化界面的ubuntu还要装open-vm-tools-desktop启用文件夹拖放，没有图形化界面的ubuntu装open-vm-tools。

```
sudo apt install open-vm-tools
sudo apt install open-vm-tools-desktop
```

安装完成之后重启.

参考: https://www.jianshu.com/p/cfc91cd271a2