---
title: TLS
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 安全

## 双向TLS

### 生成服务端证书

::: warning
请替换frq.ricolxwz.io为你的域名, 因为frpc会根据本地的ca-server.crt检查服务器发过来的证书的签名中是否也是frp.ricolxwz.io. 同样的, frpc的配置文件中的地址应该改成frp.ricolxwz.io, 这样就可以顺利验证. 或者写IP也行, 这样的话frpc配置文件中也要写IP.
:::

1. 配置OpenSSL
    ```
    cat > my-openssl.cnf << EOF
    [ ca ]
    default_ca = CA_default
    [ CA_default ]
    x509_extensions = usr_cert
    [ req ]
    default_bits        = 2048
    default_md          = sha256
    default_keyfile     = privkey.pem
    distinguished_name  = req_distinguished_name
    attributes          = req_attributes
    x509_extensions     = v3_ca
    string_mask         = utf8only
    [ req_distinguished_name ]
    [ req_attributes ]
    [ usr_cert ]
    basicConstraints       = CA:FALSE
    nsComment              = "OpenSSL Generated Certificate"
    subjectKeyIdentifier   = hash
    authorityKeyIdentifier = keyid,issuer
    [ v3_ca ]
    subjectKeyIdentifier   = hash
    authorityKeyIdentifier = keyid:always,issuer
    basicConstraints       = CA:true
    EOF
    ```
2. 生成CA的公钥和私钥
    ```
    openssl genrsa -out /home/wenzexu/man/frp/ssl/ca-server.key 2048
    openssl req -x509 -new -nodes -key /home/wenzexu/man/frp/ssl/ca-server.key -subj "/CN=example.ca.com" -days 5000 -out /home/wenzexu/man/frp/ssl/ca-server.crt
    ```
3. 生成一个服务端的私钥
    ```
    openssl genrsa -out /home/wenzexu/man/frp/ssl/server.key 2048
    ```

4. 生成一个CSR数字签名请求
    ```
    openssl req -new -sha256 -key /home/wenzexu/man/frp/ssl/server.key \
    -subj "/C=XX/ST=DEFAULT/L=DEFAULT/O=DEFAULT/CN=server.com" \
    -reqexts SAN \
    -config <(cat my-openssl.cnf <(printf "\n[SAN]\nsubjectAltName=DNS:frp.ricolxwz.io")) \
    -out /home/wenzexu/man/frp/ssl/server.csr
    ```

5. 使用CSR向CA发起签名请求, 并返回服务端公钥
    ```
    openssl x509 -req -days 365 -sha256 \
    -in /home/wenzexu/man/frp/ssl/server.csr -CA /home/wenzexu/man/frp/ssl/ca-server.crt -CAkey /home/wenzexu/man/frp/ssl/ca-server.key -CAcreateserial \
    -extfile <(printf "subjectAltName=DNS:frp.ricolxwz.io") \
    -out /home/wenzexu/man/frp/ssl/server.crt
    ```
6. 移除不必要的文件
    ```
    rm /home/wenzexu/man/frp/ssl/ca-server.key
    rm /home/wenzexu/man/frp/ssl/ca-server.srl
    rm /home/wenzexu/man/frp/ssl/server.csr
    rm /home/wenzexu/man/frp/ssl/my-openssl.cnf
    ```

### 生成客户端证书

1. 配置OpenSSL
    ```
    cat > my-openssl.cnf << EOF
    [ ca ]
    default_ca = CA_default
    [ CA_default ]
    x509_extensions = usr_cert
    [ req ]
    default_bits        = 2048
    default_md          = sha256
    default_keyfile     = privkey.pem
    distinguished_name  = req_distinguished_name
    attributes          = req_attributes
    x509_extensions     = v3_ca
    string_mask         = utf8only
    [ req_distinguished_name ]
    [ req_attributes ]
    [ usr_cert ]
    basicConstraints       = CA:FALSE
    nsComment              = "OpenSSL Generated Certificate"
    subjectKeyIdentifier   = hash
    authorityKeyIdentifier = keyid,issuer
    [ v3_ca ]
    subjectKeyIdentifier   = hash
    authorityKeyIdentifier = keyid:always,issuer
    basicConstraints       = CA:true
    EOF
    ```
2. 生成CA的公钥和私钥
    ```
    openssl genrsa -out /Users/wenzexu/man/frp/ssl/ca-client.key 2048
    openssl req -x509 -new -nodes -key /Users/wenzexu/man/frp/ssl/ca-client.key -subj "/CN=example.ca.com" -days 5000 -out /Users/wenzexu/man/frp/ssl/ca-client.crt
    ```
3. 生成一个客户端的私钥
    ```
    openssl genrsa -out /Users/wenzexu/man/frp/ssl/client.key 2048 
    ```
4. 生成一个CSR数字签名请求
    ```
    openssl req -new -sha256 -key /Users/wenzexu/man/frp/ssl/client.key \
    -subj "/C=XX/ST=DEFAULT/L=DEFAULT/O=DEFAULT/CN=client.com" \
    -reqexts SAN \
    -config <(cat my-openssl.cnf <(printf "\n[SAN]\nsubjectAltName=DNS:localhost,IP:127.0.0.1")) \
    -out /Users/wenzexu/man/frp/ssl/client.csr 
    ```
5. 使用CSR向CA发起签名请求, 并返回客户端的公钥
    ```
    openssl x509 -req -days 365 -sha256 \
    -in /Users/wenzexu/man/frp/ssl/client.csr -CA /Users/wenzexu/man/frp/ssl/ca-client.crt -CAkey /Users/wenzexu/man/frp/ssl/ca-client.key -CAcreateserial \
    -extfile <(printf "subjectAltName=DNS:localhost,IP:127.0.0.1") \
    -out /Users/wenzexu/man/frp/ssl/client.crt
    ```
6. 移除不必要的文件
    ```
    rm /Users/wenzexu/man/frp/ssl/ca-client.key
    rm /Users/wenzexu/man/frp/ssl/ca-client.srl
    rm /Users/wenzexu/man/frp/ssl/client.csr
    rm /Users/wenzexu/man/frp/ssl/my-openssl.cnf
    ```

### 交换CA公钥

使用SMTP服务交换服务端和客户端的CA公钥. 然后移除不必要的文件:

```
rm /Users/wenzexu/man/frp/ssl/ca-client.crt
```

```
rm /home/wenzexu/man/frp/ssl/ca-server.crt
```