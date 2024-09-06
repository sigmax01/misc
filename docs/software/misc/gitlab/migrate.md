---
title: 迁移
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 迁移

1. 检查gitlab是否有问题
    1. `docker compose exec gitlab gitlab-rake gitlab:check`
    2. `docker compose exec gitlab gitlab-rake gitlab:geo:check`
2. 记录当前Gitlab的容器镜像版本号(可以直接在UI中查看): `docker compose exec gitlab cat /opt/gitlab/embedded/service/gitlab-rails/VERSION`
3. 备份数据
    1. 关闭安装前数据库自动备份: `docker compose exec gitlab touch /etc/gitlab/skip-auto-backup`
    2. `mkdir ./gitlab-bak`
    3. `docker compose exec gitlab gitlab-backup create`
    4. `docker compose cp gitlab:/var/opt/gitlab/backups/<_gitlab_backup.tar文件>  ./gitlab-bak/`
    5. `docker compose cp gitlab:/etc/gitlab/gitlab.rb  ./gitlab-bak/`
    6. `docker compose cp gitlab:/etc/gitlab/gitlab-secrets.json  ./gitlab-bak/`
4. 将`./gitlab-bak`打包为`.tar.gz`文件: `tar -czvf gitlab-bak.tar.gz gitlab-bak`
5. 在新机器上上传`gitlab-bak.tar.gz`文件解压: `tar -xzvf gitlab-bak.tar.gz`
6. 启动gitlab服务: `docker comose up -d gitlab`
7. 恢复数据
    1. `chmod 777 ./gitlab-bak/<_gitlab_backup.tar文件>`
    2. `docker compose exec gitlab gitlab-ctl stop unicorn`
    3. `docker compose exec gitlab gitlab-ctl stop sidekiq`
    4. `docker compose cp ./gitlab-bak/<_gitlab_backup.tar文件>  gitlab:/var/opt/gitlab/backups/`
    5. `docker compose cp ./gitlab-bak/gitlab-secrets.json   gitlab:/etc/gitlab/`
    6. `docker compose cp ./gitlab-bak/gitlab.rb   gitlab:/etc/gitlab/`
    7. `docker compose exec gitlab gitlab-rake gitlab:backup:restore`
    8. `docker compose exec gitlab gitlab-ctl start`