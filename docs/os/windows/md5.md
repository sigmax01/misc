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
    param(
        [int]$Fuzz1 = 2,  # Default value for Fuzz1
        [int]$Fuzz2 = 2   # Default value for Fuzz2
    )

    # Save the current working directory
    $current_dir = Get-Location

    # Define relevant directories
    $snip_dir = "C:\Users\wenzexu\Pictures\Screenshots"

    # Get the latest file
    $latest_file = Get-ChildItem -Path $snip_dir | Sort-Object LastWriteTime -Descending | Select-Object -First 1

    if ($latest_file) {

        # Calculate MD5 hash
        $md5_hash = (Get-FileHash -Path $latest_file.FullName -Algorithm MD5).Hash.ToLower()

        # Get file extension and convert to lowercase
        $extension = $latest_file.Extension.TrimStart(".").ToLower()

        # Process original image
        if ($extension -in @("jpg", "jpeg", "png")) {
            $new_extension = "webp"
            $new_name = "$md5_hash.$new_extension"
            $new_path = Join-Path $snip_dir $new_name

            # Use ImageMagick to process the image
            magick "$($latest_file.FullName)" -quality 100 -define webp:lossless=true -fuzz "$Fuzz1%" -fill white -opaque white "$new_path"
        }
        else {
            if ($latest_file.Name -ne $extension) {
                $new_name = "$md5_hash.$extension"
            }
            else {
                $new_name = "$md5_hash"
            }
            $new_path = Join-Path $snip_dir $new_name
            Rename-Item -Path $latest_file.FullName -NewName $new_name
        }

        # Generate URL for the original image
        $original_url = "https://img.ricolxwz.io/$new_name"

        # Generate URL for the inverted image
        $inverted_name = "${md5_hash}_inverted.$extension"
        $inverted_url = "https://img.ricolxwz.io/$inverted_name"

        # Perform color inversion on the image
        $inverted_path = Join-Path $snip_dir $inverted_name
        magick "$new_path" -negate `
            -fuzz "$Fuzz2%" -fill "rgb(18,19,23)" -opaque black `
            -fuzz "$Fuzz2%" -fill "rgb(226,228,233)" -opaque white `
            -quality 100 `
            "$inverted_path"

        Write-Output "Processed image: $new_name"

        # Prompt to ask whether to perform upload
        $upload_choice = Read-Host "Do you want to perform the upload operation? (Default no, enter y to proceed) [y/N]"

        if ($upload_choice -match '^[Yy]$' -or $upload_choice -eq '') {
            Write-Output "Starting upload operation..."

            try {
                # Upload images to Amazon S3
                aws s3 cp "$new_path" "s3://ricolxwz-image/" --profile image
                aws s3 cp "$inverted_path" "s3://ricolxwz-image/" --profile image

                # Upload images to Cloudflare R2
                wrangler r2 object put "ricolxwz-image/$new_name" --file "$new_path"
                wrangler r2 object put "ricolxwz-image/$inverted_name" --file "$inverted_path"

                Write-Output "All upload operations completed."

                # Copy original image URL to clipboard
                $original_url | Set-Clipboard
                Write-Output "Original image URL has been copied to the clipboard. Please paste to save."

                Read-Host "Press Enter to continue and copy the inverted image URL."

                # Copy inverted image URL to clipboard
                $inverted_url | Set-Clipboard
                Write-Output "Inverted image URL has been copied to the clipboard. Please paste to save."
            }
            catch {
                Write-Error "An error occurred during upload: $_"
                return
            }

            # Prompt to ask whether to perform rollback
            $rollback_choice = Read-Host "Do you want to perform rollback operation? (Default no, enter y to proceed) [y/N]"

            if ($rollback_choice -match '^[Yy]$') {
                Write-Output "Starting rollback operation..."

                # Define rollback function
                function Rollback($file_name) {
                    try {
                        # Remove file from Amazon S3
                        aws s3 rm "s3://ricolxwz-image/$file_name" --profile image

                        # Remove file from Cloudflare R2
                        wrangler r2 object delete "ricolxwz-image/$file_name"
                    }
                    catch {
                        Write-Error "An error occurred while rolling back ${file_name}: $_"
                    }
                }

                # Rollback original image
                Rollback $new_name

                # Rollback inverted image
                Rollback $inverted_name

                Write-Output "Rollback operation completed."
            }
            else {
                Write-Output "Rollback operation not performed."
            }
        }
        else {
            Write-Output "Upload operation not performed."
        }

        # Return to the initial directory
        Set-Location $current_dir
    }
    else {
        Write-Host "No files found."
    }
}


```