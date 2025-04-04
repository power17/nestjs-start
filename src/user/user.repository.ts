import { Inject, Injectable, Optional } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserTypeormRepository } from './repository/user.typeorm.repository';
import { UserAdapter } from './user.interface';

// import { UserAbstractRepository } from './user-abstract.repository';
import * as argon2 from 'argon2';

@Injectable()
export class UserRepository implements UserAdapter {
  constructor(
    @Inject(REQUEST) private request: Request,
    @Optional() private userTypeormRepository: UserTypeormRepository,
  ) {}
  findAll(page: number = 1, limit: number = 10): Promise<any[]> {
    const client = this.getRepository();
    return client.findAll(page, limit);
  }
  findOne(username: string): Promise<any> {
    const client = this.getRepository();
    return client.findOne(username);
  }
  async create(userObj: any): Promise<any> {
    const client = this.getRepository();
    // 对密码进行hash处理
    const { password } = userObj;
    const newHashPass = await argon2.hash(password);
    userObj = { ...userObj, password: newHashPass };
    const res = client.create(userObj);
    return res;
  }
  update(userObj: any): Promise<any> {
    const client = this.getRepository();
    return client.update(userObj);
  }
  delete(id: string): Promise<any> {
    const client = this.getRepository();
    return client.delete(id);
  }
  getRepository(): UserAdapter {
    // 根据tenant逻辑 或其他逻辑，获取数据库类型 -> 根据不同的类型访问不同的数据库
    const headers = this.request.headers;
    const tenantId = headers['x-tenant-id'] || 'default';
    // console.log('🚀 ~ UserRepository ~ getRepository ~ tenantId:', tenantId);
    return this.userTypeormRepository;
  }
}
