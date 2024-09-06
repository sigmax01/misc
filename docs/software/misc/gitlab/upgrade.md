---
title: 升级
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 升级

1. 检查gitlab是否有问题
    1. `docker compose exec -f app.yaml gitlab gitlab-rake gitlab:check`
    2. `docker compose exec -f app.yaml gitlab gitlab-rake gitlab:geo:check`
2. 备份当前数据, 记录当前Gitlab的容器镜像版本号(可以直接在UI中查看): `docker compose exec -f app.yaml gitlab cat /opt/gitlab/embedded/service/gitlab-rails/VERSION`
    1. 关闭安装前数据库自动备份: `docker compose exec -f app.yaml gitlab touch /etc/gitlab/skip-auto-backup`
    2. `mkdir ./gitlab-bak`
    3. `docker compose exec -f app.yaml gitlab gitlab-backup create`
    4. `docker compose cp -f app.yaml gitlab:/var/opt/gitlab/backups/<_gitlab_backup.tar文件>  ./gitlab-bak/`
    5. `docker compose cp -f app.yaml gitlab:/etc/gitlab/gitlab.rb  ./gitlab-bak/`
    6. `docker compose cp -f app.yaml gitlab:/etc/gitlab/gitlab-secrets.json  ./gitlab-bak/`
    7. 双重备份: `tar -czvf gitlab-aux.tar.gz ./app/gitlab`; `tar -czvf gitlab-runner-aux.tar.gz ./app/gitlab-runner`, 下载这两个文件
3. 确保后台没有迁移任务
    1. `docker compose exec -f app.yaml gitlab gitlab-rails runner -e production 'puts Gitlab::BackgroundMigration.remaining'`: 这是未执行的后台迁移任务的数量
    2. `docker compose exec -f app.yaml gitlab gitlab-rails runner -e production 'puts Gitlab::Database::BackgroundMigration::BatchedMigration.queued.count'`: 这是等待执行的批量迁移任务的数量
    3. 或者直接查看UI: http://xxx.com/admin/background_jobs
4. 保没有Runner正在处理作业, 防止runner获取到新任务
    1. 编辑`./app/gitlab/config/gitlab.rb`文件, 新增: `nginx['custom_gitlab_server_config'] = "location ^~ /api/v4/jobs/request {\n deny all;\n return 503;\n}\n"`
    2. `docker compose exec -f app.yaml gitlab gitlab-cli reconfigure`
    3. 再次确认是否有正在运行的runner任务
5. 确定升级路径: https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/, 请注意要选择gilab和gitlab-runner都有的最终版本号, 如gitlab有17.2.1-ce.0, gitlab-runner有v17.2.1
6. 升级gitlab
    1. 升级postgresql数据库(可选, 一般gitlab升级的时候会自动升级postgresql)
        1. 查看gitlab版本和postgresql对应关系https://docs.gitlab.com/ee/administration/package_information/postgresql_versions.html
        2. 查看剩余磁盘空间是否足够存下另一个数据库副本: `docker compose exec -f app.yaml gitlab du -sh /var/opt/gitlab/postgresql/data`
        3. 升级到对应版本: `docker compose exec -f app.yaml gitlab gitlab-ctl pg-upgrade -V 14`, 注意修改14为你要的版本
    2. 修改`app.yaml`文件中`gitlab`服务的版本号
    3. `docker compose stop -f app.yaml gitlab && docker compose rm -f app.yaml gitlab`
    4. `docker compose up -f app.yaml -d gitlab`
    5. 查看日志, 是否升级成功: `docker compose logs -f app.yaml gitlab`
    6. 按照升级路径重复上述过程
7. 升级gitlab-runner: 
    1. 修改`app.yaml`文件中`gitlabr-runner`服务的版本号和gitlab最后的版本号匹配
    2. `docker compose stop -f app.yaml gitlab-runner && docker compose rm -f app.yaml gitlab-runner`
    3. `docker compose up -f app.yaml -d gitlab-runner`
8. 恢复自动备份, 恢复runner获取任务
    1. `docker compose exec -f app.yaml gitlab rm /etc/gitlab/skip-auto-backup`
    2. 编辑`./app/gitlab/config/gitlab.rb`文件, 删去`nginx['custom_gitlab_server_config'] = "location ^~ /api/v4/jobs/request {\n deny all;\n return 503;\n}\n"`
9. 更新github中的`app.yaml`文件为当前版本: gitlab和gitlab-runner
10. 删除多余的镜像`docker rmi <镜像1>`, `docker rmi <镜像2>`, ...

## 参考资料

- https://docs.gitlab.com/ee/update
- https://www.soulchild.cn/post/684987326/
- https://blog.csdn.net/weixin_45623111/article/details/135593376
