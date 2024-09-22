---
title: 脚本
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 脚本

## `echo`

- `-n`: 取消末尾的回车符
- `-e`: 解释双引号和单引号里面的特殊字符, 如换行符

## 命令的组合符

- `&&`: 前一个命令运行成功则继续执行后一个命令
- `||`: 前一个命令运行失败则执行后一个命令
- `;`: 先执行前一个命令, 再执行后一个命令

## 判断内外部命令

可以使用`type`判断一个命令是否是外部命令.

- `-a`: 查看一个命令的所有定义
- `-t`: 返回一个命令的类型, 是别名, 关键词, 函数, 内置命令还是文件

## 快捷键

- ctrl + l: 清屏并将当前行移至页面顶部
- ctrl + c: 中止当前正在执行的命令
- shift + pageup: 向上滚动
- shift + pagedown: 向下滚动
- ctrl + u: 光标移到行首
- ctrl + k: 光标移到行尾
- ctrl + w: 删除光标位置的前一个单词
- ctrl + d: 关闭shell对话
- 方向键上下: 浏览已经执行的命令的历史记录