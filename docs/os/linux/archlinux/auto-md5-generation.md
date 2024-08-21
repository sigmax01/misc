---
title: 自动重命名文件为md5
layout: doc
navbar: true
sidebar: false
aside: false
outline: 2
lastUpdated: false
editLink: false
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