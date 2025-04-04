# nest 模版启动项目

## 描述

- 基于 Nest 快速启动项目，包含了项目开发常用功能模块和最佳实践。
- 采用swc编译

```sh
pnpm install
pnpm run dev:start  # dev

# mongo(window)
docker ps | findstr  mongo
docker exec -it nestjs-start-mongo-1 mongosh -u root -p
# 新建角色
use nest;
db.createUser({user: 'root', pwd: 'example', roles: [{role: 'dbOwner', db: 'nest'}]});
```

## 发送邮件

```js
await this.mailerService
  .sendMail({
    to: '123213@163.com', // list of receivers
    from: '12323@qq.com', // sender address
    subject: 'Testing Nest MailerModule ✔', // Subject line
    template: 'welcome',
    context: {
      name: 'test',
    },
  })
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });
```
