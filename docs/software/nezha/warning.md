---
title: 告警
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 告警

## 离线告警

```
[
  {
    "type": "offline",
    "duration": 10,
    "cover": 0
  }
]
```

## CPU告警

```
[
    {
        "type": "cpu",
        "duration": 80,
        "max": 50,
        "cover": 0
    }
]
```

## 内存告警

```
[
    {
        "type": "memory",
        "duration": 80,
        "max": 40,
        "cover": 0
    }
]
```