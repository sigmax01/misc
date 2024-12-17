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
        extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
        if [ "$extension_lower" = "jpg" ] || [ "$extension_lower" = "jpeg" ] || [ "$extension_lower" = "png" ]; then
            new_name="${md5_hash}.webp"
            magick "/Users/wenzexu/snip/$latest_file" -quality 100 -define webp:lossless=true "/Users/wenzexu/snip/$new_name"
        else
            if [ "$latest_file" != "$extension" ]; then
                new_name="${md5_hash}.${extension_lower}"
            else
                new_name="${md5_hash}"
            fi
            mv "/Users/wenzexu/snip/$latest_file" "/Users/wenzexu/snip/$new_name"
        fi
        if [ "$extension_lower" = "svg" ]; then
            wrangler r2 object put ricolxwz-image/"$new_name" --file="/Users/wenzexu/snip/$new_name" --content-type "image/svg+xml"
        else
            wrangler r2 object put ricolxwz-image/"$new_name" --file="/Users/wenzexu/snip/$new_name"
        fi
        cd /Users/wenzexu/image
        # git pull
        mv /Users/wenzexu/snip/"$new_name" /Users/wenzexu/image/
        # git add .
        # git commit -m "$(date +"%Y-%m-%d")"
        # git push origin
        aws s3 cp /Users/wenzexu/image/$new_name s3://ricolxwz-image/ --profile image
        echo -n "https://img.ricolxwz.io/$new_name" | pbcopy
        cd $current_dir
    else
        echo "No files found."
    fi
}
```