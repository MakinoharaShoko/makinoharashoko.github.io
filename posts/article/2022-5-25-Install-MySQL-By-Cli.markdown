---
layout:     post
title:      MySQL installation by CLI
intro:   ""
date:       2022-5-25 23:30:00
author:     "Mahiru"
catalog: true
tags:
    - 工程开发
---

## 命令行安装 MySQL

### 配置环境变量

#### 新建变量

```
变量名：MYSQL_HOME

值：安装路径
```

#### 添加PATH路径

```
%MYSQL_HOME%\bin
```

### 安装MySQL

#### 初始化并记录初始化密码

```shell
mysqld --initialize --console
```

#### 将MySQL安装为Windows的服务

```shell
mysqld -install
```

#### 启动MySQL

```shell
net start MySQL
```

#### 登陆数据库，并输入前面记录的临时密码

```shell
mysql -u root -p
```

#### 修改自己的密码：123456  ,命令一定要包括分号

```mysql
alter user 'root'@'localhost' identified by '123456';
alter user 'root'@'localhost' identified with mysql_native_password by '123456';  
```

#### 最后提交 

```mysql
commit;
```

## 补充：删除MySQL

```shell
net stop mysql
mysqld -remove
```

## 补充：连接MySQL

### SpringBoot

```properties
#MYSQL链接
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306[(可选)/database]?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=123456
```

### NestJS

#### 引入包

```
yarn add @nestjs/typeorm typeorm mysql2
```

#### 导入到`app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}

```

另外，我们可以创建 `ormconfig.json` ，而不是将配置对象传递给 `forRoot()`。

```bash
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "test",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}
```

然后，我们可以不带任何选项地调用 `forRoot()` :

> app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot()],
})
export class AppModule {}
```
