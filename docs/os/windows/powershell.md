---
title: Powershell
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# Powershell

## 常用命令

- `set-location`: 改变当前目录 
- `get-location`: 打印当前目录路径
- `get-childitem`: 打印当前目录下的文件/目录
- `write-host <param>`: 打印变量的值
- `<param> = read-host -Prompt <prompt>`: 读取终端输入
- `$param = @[]`: 列表
- `$param = @{}`: 字典

## 条件

```powershell
$PokemonCaught = "911"
if ($PokemonCaught -eq 908) { write-host "You are a pokemon master!" } elseif ($PokemonCaught -ge 910) { write-host "what?" } else { write-host "Go catch more pokemon!" }
```

## 循环

```powershell
$halopeeps = @("Master Chief", "Cortana", "Captain Keyes", "Flood")
for ($counter = 0; $counter -le 3; $counter ++) {
    write-host "Holy smokes, it's" $halopeeps[$counter]
}
```

```powershell
$halopeeps = @("Master Chief", "Cortana", "Captain Keyes", "Flood")
foreach ($peep in $halopeeps) {
    write-host $peep
}
```

```powershell
$Xmen = @('Wolverine', 'Cyclops', 'Storm', 'Professor X')
$counter = 0
while ($counter -ne 6) {
    write-host $Xmen[$counter]
    $counter ++
}
```

```powershell
$Xmen = @('Wolverine', 'Cyclops', 'Storm', 'Professor X')
$counter = 0
do {
    write-host "Xmen[$counter]"
    $counter++
} while ($counter -ne 6)
```

## 函数

