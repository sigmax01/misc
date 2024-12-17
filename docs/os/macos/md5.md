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

```shell
md5p() {
    # 保存当前工作目录
    local current_dir
    current_dir=$(pwd)
    
    # 定义相关目录和日志文件
    local snip_dir="/Users/wenzexu/snip"
    
    # 获取最新的文件
    local latest_file
    latest_file=$(ls -t "$snip_dir" | head -n 1)
    
    if [[ -n "$latest_file" ]]; then
        
        # 计算 MD5 哈希值
        local md5_hash
        md5_hash=$(md5 -qs "$snip_dir/$latest_file")
        
        # 获取文件扩展名并转为小写
        local extension extension_lower
        extension="${latest_file##*.}"
        extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
        
        # 处理原始图片
        local new_name
        if [[ "$extension_lower" == "jpg" || "$extension_lower" == "jpeg" || "$extension_lower" == "png" ]]; then
            extension_lower="webp"
            new_name="${md5_hash}.${extension_lower}"
            magick "$snip_dir/$latest_file" -quality 100 -define webp:lossless=true -fuzz 20% -fill white -opaque white "$snip_dir/$new_name"
        else
            if [[ "$latest_file" != "$extension" ]]; then
                new_name="${md5_hash}.${extension_lower}"
            else
                new_name="${md5_hash}"
            fi
            mv "$snip_dir/$latest_file" "$snip_dir/$new_name"
        fi

        # 生成原始图片的 URL
        local original_url="https://img.ricolxwz.io/$new_name"
        
        # 生成反转图片的 URL
        local inverted_name="${md5_hash}_inverted.${extension_lower}"
        inverted_url="https://img.ricolxwz.io/$inverted_name"

        # 复制原始图片的 URL 到剪贴板
        echo -n "$original_url" | pbcopy
        echo "原始图片 URL 已复制到剪贴板。请粘贴以保存。"
        echo "按 Enter 键继续复制转色调图片 URL 。"
        read
        echo -n "$inverted_url" | pbcopy
        echo "反转图片 URL 已复制到剪贴板。请粘贴以保存。"

        magick "$snip_dir/$new_name" -negate \
            -fuzz 10% -fill "rgb(18,19,23)" -opaque black \
            -fuzz 10% -fill "rgb(226,228,233)" -opaque white \
            -quality 100 \
            "$snip_dir/$inverted_name"
        echo "已处理: $new_name -> $inverted_name"
        
        # 询问是否执行上传
        echo "是否执行上传操作？（默认否，按 Enter 键继续）[y/N]: "
        read -r upload_choice
        upload_choice=${upload_choice:-Y}  # 默认值为 Y

        if [[ "$upload_choice" =~ ^[Yy]$ ]]; then
            echo "开始执行上传操作..."
        
            # 1. 上传图片到 Amazon S3
            aws s3 cp "$snip_dir/$new_name" s3://ricolxwz-image/ --profile image
            aws s3 cp "$snip_dir/$inverted_name" s3://ricolxwz-image/ --profile image

            # 2. 上传图片到 Cloudflare R2
            wrangler r2 object put ricolxwz-image/"$new_name" --file="$snip_dir/$new_name"
            wrangler r2 object put ricolxwz-image/"$inverted_name" --file="$snip_dir/$inverted_name"
            
            # 输出成功提示
            echo "所有上传操作已完成。"

            # 询问是否执行回滚
            echo "是否执行回滚操作？（默认否，按 Enter 键继续）[y/N]: "
            read -r -t 10 rollback_choice
            if [ $? -gt 128 ]; then
                rollback_choice="N"
            fi
            rollback_choice=${rollback_choice:-N}  # 默认值为 N
            
            if [[ "$rollback_choice" =~ ^[Yy]$ ]]; then
                echo "开始执行回滚操作..."
                
                # 回滚函数
                rollback() {
                    local file_name="$1"
                    
                    # 从 Amazon S3 移除文件
                    aws s3 rm s3://ricolxwz-image/"$file_name" --profile image
                    
                    # 从 Cloudflare R2 移除文件
                    wrangler r2 object delete ricolxwz-image/"$file_name"
                }
                
                # 回滚原始图片
                rollback "$new_name"
                
                # 回滚反转图片
                rollback "$inverted_name"
                
                echo "回滚操作已完成。"
            else
                echo "未执行回滚操作。"
            fi
        else
            echo "未执行上传操作。"
        fi
        
        # 返回到初始目录
        cd "$current_dir"
    fi
}
```