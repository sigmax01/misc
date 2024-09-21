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
- `new-item -type file`: 创建新文件
- `new-item -type directory`: 创建新目录
- `copy-item <原文件> -destination <目标文件>`: 复制文件
- `move-item <原文件> -destination <目标文件>`: 移动文件
- `remove-item <文件>`: 移除文件
- `test-path <path>`: 测试path是否存在
- `rename-item <文件> -newname <新名字>`: 重命名文件
- `get-content`: 打印文件内容
- `select-string`: 搜索文本, 类似于grep
- `get-process`: 显示进程
- `invoke-restmethod`: 网络请求, 类似于curl或者wget
- `get-command`: 查找命令
- `get-volume`: 查看卷的信息
- `stop-process -id <id>`: 终止某个进程
- `get-service`: 列出所有服务
- `start-service -name <name>`: 启动某个服务
- `stop-service -name <name>`: 终止某个服务

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

```powershell
function test-spacex {
    param (
        $pingcount
    )
    test-connection spacex.com -Count $pingcount
}
test-spacex -pingcount 10
```

```powershell
function test-spacex {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [int32] $pingcount
    )
    test-connection spacex.com -Count $pingcount
}
test-spacex
```

## 错误

```powershell
# throw "it's a trap"
write-error -message "It's a trap!" -erroraction stop
```

```powershell
function test-spacex {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [int32] $pingcount
    )
    test-connection spacex.com -Count $pingcount
    write-error -message "It's a trap!" -erroraction stop
}
try {
    test-spacex -erroraction stop
} catch {
    write-output "launch problem!"
    write-output $_
}
```