---
title: mkdocs-git-committers-plugin-2配置 
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# mkdocs-git-committers-plugin-2配置

1. Github生成一个Token, 权限选择好, 限定在需要使用的仓库上
2. 到仓库-设置-Secrets and variables-Actions, 可以看到, 这里有4种选项
    - Env Secrets: Secrets表示加密, 在Action的log中不会显示这个环境变量的值, 由`***`代替, 在执行的时候, 通过`${{ secrets.<name> }}`实现注入, Env表示这个变量只在特定的环境下有用, 比如说某一个Action, 某个开发环境, 生产环境
    - Repo Secrets: Secrets表示加密, 在Action的log中不会显示这个环境变量的值, 由`***`代替, 在执行的时候, 通过`${{ secrets.<name> }}`实现注入, Repo表示这个变量是在整个仓库中所有的Action中都可以被访问到
    - Env Variables: Variables表示普通变量, 在Action的log会显示这个环境变量的值, 在执行的时候, 通过`${{ vars.<name> }}`实现注入, Env表示这个变量只在特定的环境下有用, 比如说某一个Action, 某个开发环境, 生产环境
    - Repo Variables: Variables表示普通变量, 在Action的log会显示这个环境变量的值, 在执行的时候, 通过`${{ vars.<name> }}`实现注入, Repo表示这个变量是在整个仓库中所有的Action中都可以被访问到

    此外, 还有一些环境变量存在于`env`(上下文环境变量)或者默认环境变量, 如`CI`(默认为`true`). 我们选择添加Repo Secrets, 名称为`KDOCS_GIT_COMMITTERS_APIKEY`, 值为刚才设置好的Token.
3. 修改ci.yml文件: 在`gh-deploy`任务下注入环境变量
    ```yml
    - run: mkdocs gh-deploy --force
            env:
                MKDOCS_GIT_COMMITTERS_APIKEY: ${{ secrets.MKDOCS_GIT_COMMITTERS_APIKEY }}
    ```
4. 修改mkdocs.yaml文件, 配置该插件
    ```yaml
    - git-committers:
      repository: ricolxwz/gk
      branch: master
      enabled: !ENV [CI, false]  # 这个表示查看环境变脸该, 如果CI为真, 那么就设置为CI的值, 即true, 如果不为真, 那么设置为false. 等同于本地开发下关闭这个插件
    ```
5. 将更改推送到远程分支, 就可以了