---
title: Https
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# Https

## 申请证书 

```
export HOME=/root
apt install socat cron -y
cd /root
curl https://get.acme.sh | sh
read -p "Enter email: " email
read -p "Enter domain: " domain
echo "Please choose an SSL provider:"
options=("letsencrypt" "buypass" "zerossl" "ssl.com" "google")
select opt in "${options[@]}"
do
    case $opt in
        "letsencrypt")
            echo "Switching to Let's Encrypt"
            /root/.acme.sh/acme.sh --set-default-ca --server letsencrypt
            break
            ;;
        "buypass")
            echo "Switching to Buypass"
            /root/.acme.sh/acme.sh --set-default-ca --server buypass
            break
            ;;
        "zerossl")
            echo "Switching to ZeroSSL"
            /root/.acme.sh/acme.sh --set-default-ca --server zerossl
            break
            ;;
        "ssl.com")
            echo "Switching to SSL.com"
            /root/.acme.sh/acme.sh --set-default-ca --server ssl.com
            break
            ;;
        "google")
            echo "Switching to Google Public CA"
            /root/.acme.sh/acme.sh --set-default-ca --server google
            break
            ;;
        *) echo "Invalid option. Please try again.";;
    esac
done
echo "You have selected: $opt"
mkdir -p /root/ssl
/root/.acme.sh/acme.sh --register-account -m $email
/root/.acme.sh/acme.sh --issue -d $domain --standalone
mkdir -p /root/ssl/$domain
/root/.acme.sh/acme.sh --installcert -d $domain --key-file /root/ssl/$domain/private.key --fullchain-file /root/ssl/$domain/cert.crt
```

## 设置

1. 下载刚才生成的证书和私钥到你的电脑上
2. 在设置-General-SLL certificate, 选择force https only, 然后上传证书和密钥, 点击save, 重新刷新页面, 访问9443端口

## 修改密码

重新登录后请尽快修改密码. 