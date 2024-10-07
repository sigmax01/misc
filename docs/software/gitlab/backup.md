---
title: 备份
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 备份

## 手动备份

请见[这里](/software/gitlab/migrate).

## 自动备份

### S3 存储桶创建

1. 前往 AWS 的 root 账户, 选择 IAM, 选择 Policies, 选择新建, 然后粘贴策略:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "Stmt1412062044000",
         "Effect": "Allow",
         "Action": [
           "s3:AbortMultipartUpload",
           "s3:GetBucketAcl",
           "s3:GetBucketLocation",
           "s3:GetObject",
           "s3:GetObjectAcl",
           "s3:ListBucketMultipartUploads",
           "s3:PutObject",
           "s3:PutObjectAcl"
         ],
         "Resource": ["arn:aws:s3:::ricolxwz-gitlab/*"]
       },
       {
         "Sid": "Stmt1412062097000",
         "Effect": "Allow",
         "Action": ["s3:GetBucketLocation", "s3:ListAllMyBuckets"],
         "Resource": ["*"]
       },
       {
         "Sid": "Stmt1412062128000",
         "Effect": "Allow",
         "Action": ["s3:ListBucket"],
         "Resource": ["arn:aws:s3:::ricolxwz-gitlab"]
       }
     ]
   }
   ```
2. 选择用户, 新建用户, 起名字, 不要提供管理Console的权限, 附上刚才创建的策略, 创建用户
3. 前往用户管理页面, 选择Security Credentials, 选择创建Access Key, 选择application running outside aws, 随便写一个值, 保存key和secret
4. 注意地区选择加利福尼亚州, 创建s3存储桶`ricolxwz-gitlab`

### 服务器配置

1. 下载awscli: `apt install awscli`
2. 配置: `aws configure`, 输入刚才的key和secret, 地区选择`us-west-1`, 配置信息会记录在`/home/app/.aws/credentials`和`/home/app/.aws/config`中, 如可以进行多用户配置:
    `/home/app/.aws/credentials`文件:
    ```
    [default]
    aws_access_key_id = xxxxxxxx
    aws_secret_access_key = xxxxxxxx
    [user1]
    aws_access_key_id = YYYYYYYY
    aws_secret_access_key = YYYYYYYY
    ```
    `/home/app/.aws/config`文件: 
    ```
    [default]
    region = us-west-1
    output = json
    [user1]
    region = us-west-1
    output = json
    ```

### 配置Gitlab

在`/home/app/app/gitlab/config/gitlab-rb`文件中追加:

```
gitlab_rails['backup_upload_connection'] = {
  'provider' => 'AWS',
  'region' => 'us-west-1',
  'aws_access_key_id' => '',
  'aws_secret_access_key' => ''
}
gitlab_rails['backup_upload_remote_directory'] = 'ricolxwz-gitlab'
```

然后: `docker compose -f /home/app/app.yaml exec gitlab gitlab-ctl reconfigure`

### 脚本配置

创建上传脚本`/home/app/gitlab-backup.sh`:

```
docker compose -f /home/app/app.yaml exec gitlab gitlab-backup create STRATEGY=copy
cp /home/app/app/gitlab/config/gitlab-secrets.json /home/app/gitlab-secrets.json
cp /home/app/app/gitlab/config/gitlab.rb /home/app/gitlab.rb
cp -r /home/app/app/gitlab/data /home/app
tar -czvf /home/app/gitlab-data.tar.gz /home/app/data
aws s3 cp /home/app/gitlab-secrets.json s3://ricolxwz-gitlab/services/
aws s3 cp /home/app/gitlab.rb s3://ricolxwz-gitlab/services/
aws s3 cp /home/app/gitlab-data.tar.gz s3://ricolxwz-gitlab/services/
rm /home/app/gitlab-secrets.json
rm /home/app/gitlab.rb
rm /home/app/gitlab-data.tar.gz
rm -rf /home/app/data
docker compose -f /home/app/app.yaml exec gitlab find /var/opt/gitlab/backups/ -name "*.tar" -exec rm {} \;
```

赋予脚本执行权限: `chmod u+x /home/app/gitlab-backup.sh`.

### 测试

测试一下: `/home/app/gitlab-backup.sh`, 然后看看S3上有没有文件.

### 配置定时任务

新建cron任务:

```
0 0 */10 * * /home/app/gitlab-backup.sh
```