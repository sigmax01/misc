---
title: 配置
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 配置

Cloudfront的正确使用方法为:

1. 原站服务器申请test-origin.ricolxwz.net的证书
2. DNS服务商那里将test-origin.ricolxwz.net的记录指向原站 (A记录)
3. 新增CloudFront Distribution
4. 原站域名设置为test-origin.ricolxwz.net
5. Certificate manager申请test.ricolxwz.net证书
6. Alternate domain name (CNAME) *- optional* [新增test.ricolxwz.net](http://domain新增test.ricolxwz.net) (重要! 否则CloudFront会拒绝访问)
7. Custom SSL certificate *- optional: 选择刚才创建的test.ricolxwz.net的SSL证书*
8. 点击创建
9. 将CloudFront提供的边缘服务器域名如 [d3i8ytor5ql52c.cloudfront.net](https://d3i8ytor5ql52c.cloudfront.net/)在域名服务上那边添加一条CNAME记录, 即test.ricolxwz.net的CNAME记录为[d3i8ytor5ql52c.cloudfront.net](https://d3i8ytor5ql52c.cloudfront.net/), 大工告成!
10. 补充: 实际上cloudfront提供的域名是可以直接用的, 比如说 [d3i8ytor5ql52c.cloudfront.net](https://d3i8ytor5ql52c.cloudfront.net/)这个, 当你访问它的时候, cloudfront发给你的是 [d3i8ytor5ql52c.cloudfront.net](https://d3i8ytor5ql52c.cloudfront.net/)的SSL证书, 也就是说Cloudfront的边缘服务器上有两个证书, 一个是它自己的域名 [d3i8ytor5ql52c.cloudfront.net](https://d3i8ytor5ql52c.cloudfront.net/)的证书, 一个是你设置的alternative域名test.ricolxwz.net的SSL证书, 它发哪个证书给你取决于你用哪个域名请求(或者说它也有可能两个证书都发给你, 有待验证…)