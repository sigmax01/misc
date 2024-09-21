---
title: md5
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# md5

```powershell
function md5p {
    $latest_file = Get-ChildItem -Path "C:\Users\wenzexu\Pictures\Screenshots" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latest_file) {
        $md5_hash = (Get-FileHash -Path $latest_file.FullName -Algorithm MD5 | Select-Object -ExpandProperty Hash).ToLower()
        $extension = $latest_file.Extension.TrimStart(".")
        $new_name = "${md5_hash}.${extension}"
        $new_path = Join-Path $latest_file.DirectoryName $new_name
        Rename-Item -Path $latest_file.FullName -NewName $new_name
        wrangler r2 object put ricolxwz-image/"$new_name" --file="$new_path"
        wrangler r2 object put ricolxwz-image-backup/"$new_name" --file="$new_path"
        Write-Output "https://img.ricolxwz.io/$new_name" | Set-Clipboard
    } else {
        Write-Host "No files found."
    }
}
```