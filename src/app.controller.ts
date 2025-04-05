import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { MailerService } from '@nestjs-modules/mailer';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User) private readonly user,
    // @InjectModel('User') private readonly userModel,
    @InjectRedis() private readonly redis: Redis,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const res = await this.user.find();
    // const resMongo = await this.userModel.find();
    // const token = this.redis.get('token');
    // this.redis.set('token', 'test', 'EX', 60);
    // await this.mailerService
    //   .sendMail({
    //     to: 'liquanpower@163.com', // list of receivers
    //     from: '1410837981@qq.com', // sender address
    //     subject: 'Testing Nest MailerModule ✔', // Subject line
    //     template: 'welcome',
    //     context: {
    //       name: 'test',
    //     },
    //   })
    //   .then(() => {})
    //   .catch((err) => {
    //     console.log(err);
    //   });
    return res;
  }
}
