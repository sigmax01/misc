---
title: SSH使用谷歌验证器2FA
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 使用谷歌验证器2FA

::: info
下述配置无法通过实际测试, 请不要使用.
:::

## 测试环境

Debian12 服务器

## 解决方案

1. 安装包: `sudo apt install libpam-google-authenticator`
2. 配置SSH:
    - 编辑`/etc/pam.d/sshd`文件, 加入下列行: `auth required pam_google_authenticator.so`
    - 重启sshd: `sudo systemctl restart sshd.service`
    - 编辑`/etc/ssh/sshd_config`: 将`ChallengeResponseAuthentication`从`no`改为`yes`pdf
3. 配置Google Authenticator: 输入命令`google-authenticator`, 按照提示选择配置:
    - Make tokens “time-base””: yes
    - Update the .google_authenticator file: yes
    - Disallow multiple uses: yes
    - Increase the original generation time limit: no
    - Enable rate-limiting: yes

    扫码, 记录下紧急代码
