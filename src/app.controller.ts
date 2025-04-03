import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User) private readonly user,
    @InjectModel('User') private readonly userModel,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const res = await this.user.find();
    const resMongo = await this.userModel.find();
    return res;
  }
}
