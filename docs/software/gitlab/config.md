---
title: 配置
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 配置

## UI

- Admin-Settings-General:
    - Sign-up restrictions:
        - 🈚️ Sign-up enabled
    - Visibility and access controls:
        - Enabled Git access protocols: Both SSH and HTTP(S)
    - Sign-in restrictions:
        - 🈚️ 允许通过HTTP(S)对Git进行密码验证
- Admin-Settings-CI/CD:
    - Continuous Integration and Deployment:
        - 🈚️ Default to Auto DevOps pipeline for all projects
- Admin-Settings-Repository:
    - Default branch:
        - Initial default branch name: master
- User-Preferences:
    - Integrations:
        - ✅ Enable extension marketplace (需要打开对应的feature)

## `gitlab.rb`

- `gitlab_rails['gitlab_ssh_host'] = '<你的ssh主机名>'`

## Features

```
docker exec -it gitlab gitlab-rails console # 等几分钟
Feature.enable(:<feature flag>)
Feature.disable(:<feature flag>)
Feature.all.map {|f| [f.name, f.state]} # 查看所有的features
```

- `web_ide_extensions_marketplace`: ✅