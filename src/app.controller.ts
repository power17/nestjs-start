import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntity,
    @InjectModel('User') private readonly userModel,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const res = await this.userEntity.find();
    const resMongo = await this.userModel.find();
    return resMongo;
  }
}
