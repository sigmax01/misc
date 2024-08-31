---
title: 自动重命名文件为md5
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 自动重命名文件为md5

该脚本能够自动将最近文件为md5并将哈希值复制到剪切板中 需要事先安装`xclip`用于复制到系统剪切板.

```bash
md5() {
    latest_file=$(ls -t | head -n 1)
    if [ -n "$latest_file" ]; then
        md5_hash=$(md5sum "$latest_file" | awk '{ print $1 }')
        extension="${latest_file##*.}"
        if [ "$latest_file" != "$extension" ]; then
            new_name="${md5_hash}.${extension}"
        else
            new_name="${md5_hash}"
        fi
        mv "$latest_file" "$new_name"
        echo "Renamed $latest_file to $new_name"
        echo -n "$new_name" | xclip -selection clipboard
        echo "New filename copied to clipboard: $new_name"
    else
        echo "No files found."
    fi
}
```

自动生成链接:

```bash
md5p() {
    current_dir=$(pwd)
    latest_file=$(ls -t /home/wenzexu/Pictures/屏幕截图 | head -n 1)
    if [ -n "$latest_file" ]; then
        md5_hash=$(md5sum /home/wenzexu/Pictures/屏幕截图/"$latest_file" | awk '{ print $1 }')
        extension="${latest_file##*.}"
        if [ "$latest_file" != "$extension" ]; then
            new_name="${md5_hash}.${extension}"
        else
            new_name="${md5_hash}"
        fi
        cd /home/wenzexu/img
        git pull
        mkdir -p /home/wenzexu/img/$(date +%Y)/$(date +%m)
        mv /home/wenzexu/Pictures/屏幕截图/"$latest_file" /home/wenzexu/img/$(date +%Y)/$(date +%m)/"$new_name"
        git add .
        git commit -m "Add $(date +%Y)/$(date +%m)/$new_name"
        git push origin
        echo -n "https://cdn.jsdelivr.net/gh/sigmax0124/img@master/$(date +%Y)/$(date +%m)/$new_name" | xclip -selection clipboard
        cd $current_dir
    else
        echo "No files found."
    fi
}
```

::: tip
macOS版:
```zsh
md5p() {
    current_dir=$(pwd)
    latest_file=$(ls -t /Users/wenzexu/snip | head -n 1)
    if [ -n "$latest_file" ]; then
        md5_hash=$(md5 -qs /Users/wenzexu/snip/"$latest_file")
        extension="${latest_file##*.}"
        if [ "$latest_file" != "$extension" ]; then
            new_name="${md5_hash}.${extension}"
        else
            new_name="${md5_hash}"
        fi
        cd /Users/wenzexu/img
        git pull
        mkdir -p /Users/wenzexu/img/$(date +%Y)/$(date +%m)
        mv /Users/wenzexu/snip/"$latest_file" /Users/wenzexu/img/$(date +%Y)/$(date +%m)/"$new_name"
        git add .
        git commit -m "Add $(date +%Y)/$(date +%m)/$new_name"
        git push origin
        echo -n "https://cdn.jsdelivr.net/gh/sigmax0124/img@master/$(date +%Y)/$(date +%m)/$new_name" | pbcopy
        cd $current_dir
    else
        echo "No files found."
    fi
}
```
:::

::: warning
请确保`img`文件夹和屏幕截图文件夹已经就位, 并且xclip已经安装, 在用户目录执行下列操作:
```bash
git clone gh2:sigmax0124/img.git
cd img
git config user.email sigmax0124@hotmail.com
cd ..
```
:::
