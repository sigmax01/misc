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

```zsh
md5p() {
    # 保存当前工作目录
    local current_dir
    current_dir=$(pwd)
    
    # 定义相关目录和日志文件
    local snip_dir="/Users/wenzexu/snip"
    local log_file="/Users/wenzexu/md5p.log"
    
    # 检查是否传入参数以决定是否上传反转图片
    local upload_inverted=true
    
    # 获取最新的文件
    local latest_file
    latest_file=$(ls -t "$snip_dir" | head -n 1)
    
    if [[ -n "$latest_file" ]]; then
        echo "$(date +"%Y-%m-%d %H:%M:%S") - 处理文件: $latest_file" >> "$log_file"
        
        # 计算 MD5 哈希值
        local md5_hash
        md5_hash=$(md5 -qs "$snip_dir/$latest_file")
        if [[ -z "$md5_hash" ]]; then
            echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 计算 MD5 哈希值失败。" >> "$log_file"
            return 1
        fi
        
        # 获取文件扩展名并转为小写
        local extension extension_lower
        extension="${latest_file##*.}"
        extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
        
        # 处理原始图片
        local new_name
        if [[ "$extension_lower" == "jpg" || "$extension_lower" == "jpeg" || "$extension_lower" == "png" ]]; then
            new_name="${md5_hash}.webp"
            magick "$snip_dir/$latest_file" -quality 100 -define webp:lossless=true "$snip_dir/$new_name"
            if [[ $? -ne 0 ]]; then
                echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 转换为 WebP 失败。" >> "$log_file"
                return 1
            fi
        else
            if [[ "$latest_file" != "$extension" ]]; then
                new_name="${md5_hash}.${extension_lower}"
            else
                new_name="${md5_hash}"
            fi
            mv "$snip_dir/$latest_file" "$snip_dir/$new_name"
            if [[ $? -ne 0 ]]; then
                echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 重命名文件失败。" >> "$log_file"
                return 1
            fi
        fi
        
        # 上传原始图片到 Amazon S3
        aws s3 cp "$snip_dir/$new_name" s3://ricolxwz-image/ --profile image
        if [[ $? -ne 0 ]]; then
            echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 上传到 S3 失败。" >> "$log_file"
            return 1
        fi
        
        # 上传原始图片到 Cloudflare R2
        if [[ "$extension_lower" == "svg" ]]; then
            wrangler r2 object put ricolxwz-image/"$new_name" --file="$snip_dir/$new_name" --content-type "image/svg+xml"
        else
            wrangler r2 object put ricolxwz-image/"$new_name" --file="$snip_dir/$new_name"
        fi
        if [[ $? -ne 0 ]]; then
            echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 上传到 R2 失败。" >> "$log_file"
            return 1
        fi
        
        # 复制原始图片的 URL 到剪贴板
        local original_url="https://img.ricolxwz.io/$new_name"
        echo -n "$original_url" | pbcopy
        echo "$(date +"%Y-%m-%d %H:%M:%S") - 原始图片已上传: $original_url" >> "$log_file"
        
        # 提示用户复制原始图片的 URL
        echo "原始图片已上传。URL 已复制到剪贴板。请粘贴以保存。"
        echo "按 Enter 键继续上传反转色调图片（如果选择了上传反转图片）。"
        read
        
        # 检查是否需要上传反转色调的图片
        if [[ "$upload_inverted" == true ]]; then
            # 生成反转色调图片
            local inverted_name
            inverted_name="${md5_hash}_inverted.webp"
            magick "$snip_dir/$new_name" -negate "$snip_dir/$inverted_name"
            if [[ $? -ne 0 ]]; then
                echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 生成反转色调图片失败。" >> "$log_file"
                return 1
            fi
            
            # 上传反转色调图片到 Amazon S3
            aws s3 cp "$snip_dir/$inverted_name" s3://ricolxwz-image/ --profile image
            if [[ $? -ne 0 ]]; then
                echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 上传反转色调图片到 S3 失败。" >> "$log_file"
                return 1
            fi
            
            # 上传反转色调图片到 Cloudflare R2
            wrangler r2 object put ricolxwz-image/"$inverted_name" --file="$snip_dir/$inverted_name"
            if [[ $? -ne 0 ]]; then
                echo "$(date +"%Y-%m-%d %H:%M:%S") - 错误: 上传反转色调图片到 R2 失败。" >> "$log_file"
                return 1
            fi
            
            # 复制反转色调图片的 URL 到剪贴板
            local inverted_url="https://img.ricolxwz.io/$inverted_name"
            echo -n "$inverted_url" | pbcopy
            echo "$(date +"%Y-%m-%d %H:%M:%S") - 反转色调图片已上传: $inverted_url" >> "$log_file"
            
            # 输出提示信息
            echo "反转色调图片已上传。URL 已复制到剪贴板。"
            echo "反转色调图片 URL: $inverted_url"
        fi
        
        # 输出成功提示
        echo "原始图片已上传。"
        echo "原始图片 URL: $original_url"
        if [[ "$upload_inverted" == true ]]; then
            echo "反转色调图片 URL: $inverted_url"
        fi
        
        # 返回到初始目录
        cd "$current_dir"
    else
        echo "$(date +"%Y-%m-%d %H:%M:%S") - 未找到文件。" >> "$log_file"
        echo "未找到文件。"
    fi
}
```