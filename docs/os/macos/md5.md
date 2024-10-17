---
title: md5图片
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# md5图片

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
        mv /Users/wenzexu/snip/"$latest_file" /Users/wenzexu/snip/"$new_name"
        wrangler r2 object put ricolxwz-image/"$new_name" --file=/Users/wenzexu/snip/"$new_name"
        cd /Users/wenzexu/image
        mv /Users/wenzexu/snip/"$new_name" /Users/wenzexu/image/
        aws s3 cp /Users/wenzexu/image/$new_name s3://ricolxwz-image/ --profile image
        echo -n "https://img.ricolxwz.io/$new_name" | pbcopy
        cd $current_dir
    else
        echo "No files found."
    fi
}
```