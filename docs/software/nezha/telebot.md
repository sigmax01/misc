---
title: Telegram机器人通知 
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# Telegram机器人通知

请提前在 Telegram 中创建一个机器人，获取到机器人的 token 和你的 Telegram 用户 ID。

机器人的 token 和用户 ID 都是数字和字母的组合，可以在 Telegram 中与 @userinfobot 对话获取自己的用户 ID。与 @BotFather 对话，输入命令 /newbot 创建一个机器人，创建完成后可以获得机器人的 token。

得到的 token 和用户 ID 都是字符串，可以直接拼接到 URL 中，如下所示，将 botXXXXXX 中的 XXXXXX 替换为你的机器人 token，要保留其中的 bot，将 YYYYYY 替换为你的用户 ID。注意，你需要先与机器人对话，否则机器人无法发送消息给你。#NEZHA# 是占位符，不要修改和删除

- 名称：Telegram
- URL：https://api.telegram.org/botXXXXXX/sendMessage?chat_id=YYYYYY&text=#NEZHA#
- 请求方式: GET
- 请求类型: 默认
- Body: 留空