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
        - Enabled Git access protocols: Only SSH
- Admin-Settings-CI/CD:
    - Continuous Integration and Deployment:
        - 🈚️ Default to Auto DevOps pipeline for all projects
- Admin-Settings-Repository:
    - Default branch:
        - Initial default branch name: master

## `gitlab.rb`

- `gitlab_rails['gitlab_ssh_host'] = '<你的ssh主机名>'`