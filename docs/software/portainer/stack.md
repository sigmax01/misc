---
title: 栈
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 栈

Portainer中的一个栈对应于由一个`docker-compose.yaml`文件管理的所有服务. 

::: tip
`docker-compose.yaml`文件中的相对路径中`.`表示的是Host下的`/data`文件夹. 绝对路径表示的就是Host下的绝对路径. 企业版本应该会提供`.`映射到其他路径的功能.
:::

## 建立栈

1. 点击栈, 选择add stack
2. 选择Web editor, 粘贴进去你的`app.yaml`文件: https://github.com/ricolxwz/awesome-scripts/blob/master/service/app.yaml
3. 选择Addvanced Mode, 添加.env文件内容: https://github.com/ricolxwz/awesome-scripts/blob/master/service/.env
4. Enable access control
5. 选择部署
