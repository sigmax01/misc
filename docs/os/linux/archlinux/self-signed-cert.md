---
title: 自签证书
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 自签证书

## 根证书

根证书, root certificate是属于根证书颁发机构(CA)的公钥证书, 是信任链的起点. 根证书没有上层机构再为其本身作数字签名, 所以都是自签证书, 许多应用软件, 例如操作系统, 网页浏览器, 会预先安装可被信任的证书, 这代表用户授权了应用软件作为审核哪些根证书机构属于可靠. 应用软件在建立安全连接的时候, 会执行认证路径验证算法, 使用该主机提供的电子证书, 验证是否能够对应到预先安装的根证书, 从而验证从根证书到终端节点的路径是否为一条有效的验证链, 确保TLS安全连接中的身份. 

证书机构自签一张根证书的时候, 需要产生一对公开的密钥(最后会放在所有的浏览器, 操作系统上)和私有公钥, 这个过程要在公证人, 律师, 以及录影系统的监察下经过一系列严谨的程序, 在高度防护的设施内进行.

## 自签证书

我们用到的是`mkcert`工具: https://github.com/FiloSottile/mkcert. 

1. 安装`mkcert`: `sudo pacman -S nss && sudo pacman -Syu mkcert`
2. 首先, 生成一个系统的根证书`mkcert -install`, 它会显示你的根证书的公钥已经放到系统证书库和浏览器证书库里面
3. 然后, 创建一个具体证书: `mkcert -cert-file /home/wenzexu/cert.crt -key-file /home/wenzexu/private.key localhost 127.0.0.1 ::1`, 会由刚才安装的根证书进行签名, 验证的时候会沿着信任链追溯到根证书
4. 最后, 到系统`/etc/hosts`文件, 加一条`127.0.0.1 ml.dev`

::: tip
手动将根证书的公钥导入到浏览器中.
- Chrome: 一般依赖操作系统的证书库, 只要放到了操作系统证书库里面, Chrome会自动信任
- Firefox: 进入设置, 选择隐私和安全, 找到证书, 查看证书, 选择导入根证书公钥`rootCA.pem`
:::
