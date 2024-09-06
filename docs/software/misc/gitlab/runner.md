---
title: runner
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# runner

注册一个runner: 

1. 前往gitlab页面, 然后选择ci, 注册runner, 填写对应信息后获得runner的token
2. `docker compose exec -f app.yaml -it gitlab-runner gitlab-runner register`
3. 输入Gitlab的URL: https://git.ricolxwz.io
4. 输入刚才的token
5. 输入runner的名字, 随便写
6. 输入executor, 选择docker
7. 输入默认的docker image: ubuntu:24.04, 这个是默认的image, 在gitlabci文件中没注明的话用的就是这个
8. 配置完成会生成配置文件, 在`./app/gitlab-runner/config/config.toml`中, 以后可以自行修改
9. 可以通过`docker compose exec -f app.yaml -it gitlab-runner gitlab-runner unregister`取消注册
