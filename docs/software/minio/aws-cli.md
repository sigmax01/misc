---
title: awscli配置
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# awscli配置

path 风格:

```
[profile minio]
region = 
s3 =
	addressing_style = path
endpoint_url = https://s3.ricolxwz.io
```

virtual host风格, 记得参考[/software/minio/virtual-host-style]配置:

```
[profile minio]
region = 
endpoint_url = https://s3.ricolxwz.io
```

credential部分:

```
[minio]
aws_access_key_id = xxx
aws_secret_access_key = xxx
```