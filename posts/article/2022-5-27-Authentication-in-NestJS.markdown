---
layout:     post
title:      NestJS 认证与认证初步
intro:   ""
date:       2022-5-27 15:30:00
author:     "Mahiru"
catalog: true
tags:
    - 工程开发
---

## Local 认证

#### 首先，准备包 Passport

```shell
yarn add @nestjs/passport passport passport-local
yarn add @types/passport-local
```

#### 创建 Auth 模块和 User 模块

**UserService需要做什么？**

提供用户数据。

User模块的创建没有太多标准，只需要是一个单例，提供用户数据即可。在实际应用中应该再这里构建用户模型和持久层。

其中，User模块需要提供用户数据并提供方法来返回用户数据，并且需要在模块中导出。

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

```

**AuthService需要做什么？**

**提供认证的具体实现，提供JWT等......**

提供认证实现的一个例子：

```typescript
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

```

**在实际的应用程序中，我们不会以纯文本形式存储密码。 取而代之的是使用带有加密单向哈希算法的 `bcrypt` 之类的库。**

Auth 模块需要导入用户模块和PassportModule，用于认证。

Auth 模块的Provider 是 AuthService 和 LocalStrategy（用于提供认证策略）。

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
```

#### 实现策略

在`local.strategy.ts` 中实现策略，策略的具体实现依赖于 AuthService

```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

```

### local 认证

**别忘了导入 AuthModule ！**

在Controller 中引入 `@UseGuards`

```typescript
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('testguard')
export class TestguardController {
  // 在这里引入需要的认证守卫！
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}

```

也可以将要使用的AuthGuard 写成一个类

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

引入方式变为 `@UseGuards(LocalAuthGuard)`

## JWT 方式

### JWT 生成

#### 引入包

```shell
yarn add @nestjs/jwt passport-jwt
yarn add @types/passport-jwt
```

#### 在 AuthService 中加上 JWT

```typescript
constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // 别忘了在这里实例化 JwtService
  ) {}

async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
```

我们使用 `@nestjs/jwt` 库，该库提供了一个 `sign()` 函数，用于从用户对象属性的子集生成 `jwt`，然后以简单对象的形式返回一个 `access_token` 属性。注意:我们选择 `sub` 的属性名来保持我们的 `userId` 值与`JWT` 标准一致。不要忘记将 `JwtService` 提供者注入到 `AuthService`中。

我们使用 `register()` 配置 `JwtModule` ，并传入一个配置对象。

#### 修改 AuthService

```typescript
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

别忘了导出 `AuthService` 这样使用这个模块的Module 才能获取 `AuthService`

#### 更新 Controller

因为 Passport 定义的 **所有策略** 都是将validate() 方法执行的结果作为 user 属性存储在当前 **HTTP Request 对象** 上，所以我们可以得到 `username` 和 `userId`。

```typescript
@Controller('testguard')
export class TestguardController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
```

这样，我们就能得到 `AccessToken`。

`POST localhost:3000/testguard/auth/login`

x-www-form-urlencoded:`username=john&passwoed=changeme`

返回：

```JSON
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTY1MzY0MDUyMiwiZXhwIjoxNjUzNjQwNTgyfQ.gvMROxXrL_ywMDNf2IbReCxgrh6_FQYh10M34A8JxwM"}
```

### JWT 认证

#### 编写 JWT 策略

`auth/jwt.strategy.ts`

对于 `JWT` 策略，`Passport` 首先验证 `JWT` 的签名并解码 `JSON `。然后调用我们的 `validate()` 方法，该方法将解码后的 `JSON` 作为其单个参数传递。

所以，实际上我们的 `validate` 是拿到了解码后的 `JSON`，这个 `payload` 正是我们之前通过 `sign` 生成的。

所以我们只需要返回其内容。

```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

**在 `AuthModule` 中添加新的 `JwtStrategy` 作为提供者，因为现在我们提供了 JWT 作为认证方式**

```typescript
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

#### 然后，引入这个策略

`jwt-auth.guard.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

```

#### 修改 Controller

```typescript
import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('testguard')
export class TestguardController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getInfo(@Request() req) {
    return req.user;
  }
}

```

#### 测试

在 Get 时加上 请求头

```
Authorization: Bearer [Access Token]
```

即可访问被 `JwtAuthGuard` 保护的数据。

## 总结

实现认证总是需要编写以下模块：

1、`UserModule` ，作为用户数据的提供者（提供账号密码等）

2、`AuthModule`，用于提供认证策略，实现认证服务。

### UserModule 需要编写什么？

#### UserService

获取用户数据的逻辑，**这个模块需要导出并由`AuthService`引入**。

### AuthModule 需要编写什么？

#### AuthService

这个服务用于：具体实现local认证（因为密码可能散列），生成`JWT`（一般来说在生成`JWT`前已经由Local认证，并得到用户信息，这时候根据用户信息来生成`JWT`）

这个服务需要导入：`UserSercice`（用于Local认证），`JwtService`（用于生成`JWT`）

#### AuthModule

需要导入的：`UserModule`（用于让Service可以拿到用户数据）、`PassportModule` （我们实现认证的库）、`JWTModule`（用于生成`JWT`，并配置`JWT`参数）

这个模块的提供者：`AuthService`（提供认证具体实现）、`LocalStrategy`， `JwtStrategy`（具体策略）

需要导出的：`AuthService`（为什么？因为我们需要这个服务来生成`JWT`，Controller 需要这个服务来获得 `JWT`并响应。

#### 编写策略

所有的策略都是继承 `PassportStrategy(Strategy)`，实现 `validate` 方法。

`validate` 方法总是接受来自 `req` 的属性，返回的属性也会附加到 `req` 。一旦认证结束后，我们就可以从 `req`对象中拿到认证的结果。

策略的核心在于在发生错误的时候抛出 `UnauthorizedException()` 来告知无法认证，在认证通过的时候往 `req`对象上附加一些属性（这些属性可以用于返回，也可以用于生成 `JWT`）。

策略会调用 `AuthService` ，因为那里有认证的具体实现。

#### 收尾

可以导出 `jwt-auth.guard.ts`、  `local-auth.guard.ts` 简化在Controller 使用 `@UseGuards`注解时要编写的代码。
