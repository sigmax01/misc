---
title: 申请SSL证书
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 申请SSL证书

```bash
cd ~
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
            ~/.acme.sh/acme.sh --set-default-ca --server letsencrypt
            break
            ;;
        "buypass")
            echo "Switching to Buypass"
            ~/.acme.sh/acme.sh --set-default-ca --server buypass
            break
            ;;
        "zerossl")
            echo "Switching to ZeroSSL"
            ~/.acme.sh/acme.sh --set-default-ca --server zerossl
            break
            ;;
        "ssl.com")
            echo "Switching to SSL.com"
            ~/.acme.sh/acme.sh --set-default-ca --server ssl.com
            break
            ;;
        "google")
            echo "Switching to Google Public CA"
            ~/.acme.sh/acme.sh --set-default-ca --server google
            break
            ;;
        *) echo "Invalid option. Please try again.";;
    esac
done
echo "You have selected: $opt"
mkdir -p ~/ssl
~/.acme.sh/acme.sh --register-account -m $email
~/.acme.sh/acme.sh --issue -d $domain --standalone
~/.acme.sh/acme.sh --installcert -d $domain --key-file ~/ssl/private.key --fullchain-file ~/ssl/cert.crt
```

## 参考资料

https://github.com/ricolxwz/awesome-scripts/blob/master/sing-box/vmess/singbox.sh