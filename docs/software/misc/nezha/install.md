---
title: 部署探针
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 部署探针

## 获取Github的Client ID和密钥

哪吒监控使用的是Github, Gitlab, Gitee作为后台管理员账号, 所以需要创建一个OAuth App给哪吒监控提供授权登录的功能.

1. 首先, 新建一个验证应用, 打开[https://github.com/settings/developers](https://github.com/settings/developers), 依次选择"OAuth Apps", "New OAuth App". 名字随便填写, 域名填写面板的访问域名, 如`http://dashboard.example.com:8008`. 回调地址填写`http://dashboard.example.com:8008/oauth2/callback`, 在面板域名后面加上后缀`/oauth2/callback`
2. 点击注册应用
3. 保存页面中的Client ID, 然后点击"Generate a new client secret", 这个密钥要妥善保存

## 服务器中安装面板

在服务器中, 运行安装脚本: 

```bash
curl -L https://raw.githubusercontent.com/naiba/nezha/master/script/install.sh -o nezha.sh && chmod +x nezha.sh && sudo ./nezha.sh
```

1. 选择独立安装, 安装面板端
2. OAuth2提供商选择github
3. Client ID输入保存的Client ID
4. Client secret输入保存的Client secret
5. 输入Github的登录名
6. 输入站点标题
7. 输入访问端口
8. 输入Agent的通信端口

之后可以通过直接`./nezha.sh`执行脚本.

## 设置SSL

### 申请证书

注意, 申请证书之前先暂停Nginx并确保防火墙80打开.

```bash
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
~/.acme.sh/acme.sh --register-account -m $email
~/.acme.sh/acme.sh --issue -d $domain --standalone
~/.acme.sh/acme.sh --installcert -d $domain --key-file /root/private_stat.key --fullchain-file /root/cert_stat.crt
```

### 设置Nginx

debian下设置Nginx, 注意替换掉`<domain>`域名:

```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}
http {
server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name <domain>;
        ssl_certificate       /root/cert_stat.crt;
        ssl_certificate_key   /root/private_stat.key;
        ssl_session_timeout 1d;
        ssl_session_cache shared:MozSSL:10m;
        ssl_session_tickets off;
        ssl_protocols         TLSv1.2 TLSv1.3;
        ssl_ciphers           ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        location / {
            proxy_pass http://127.0.0.1:8008;
            proxy_set_header Host $http_host;
            proxy_set_header      Upgrade $http_upgrade;
        }
        location ~ ^/(ws|terminal/.+|file/.+)$ {
            proxy_pass http://127.0.0.1:8008;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $http_host;
        }
        
}
server {
        listen 80;
        server_name <domain>;
        rewrite ^(.*)$ https://${server_name}$1 permanent;
}
}
```

### 更新OAuth

打开[https://github.com/settings/developers](https://github.com/settings/developers), 更新面板域名`https://dashboard.example.com`, 回调域名`http://dashboard.example.com/oauth2/callback`.

## 安装Agent

### 设置通信域名

在面板设置页面, 在"未接入CDN的面板服务器域名/IP"项填写通信域名, 点击保存.

### 安装

1. 首先在管理面板中添加一台服务器
2. 点击新添加的服务器旁边的绿色Linux按钮, 复制一键安装指令
3. 在被控服务器中运行复制的一键安装命令, 等待安装完成后返回到面板主页查看是否上线

### 防火墙

确保打开面板服务器的`5555`端口.