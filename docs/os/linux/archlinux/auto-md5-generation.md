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
        mv "$latest_file" "$md5_hash"
        echo "Renamed $latest_file to $md5_hash"
        echo -n "$md5_hash" | xclip -selection clipboard
        echo "MD5 hash copied to clipboard: $md5_hash"
    else
        echo "No files found."
    fi
}
```