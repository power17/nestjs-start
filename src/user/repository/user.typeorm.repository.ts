import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserAdapter } from '../service/user.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTypeormRepository implements UserAdapter {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  findAll(page: number = 1, limit: number = 10): Promise<any[]> {
    return this.userRepository.find({ skip: (page - 1) * limit, take: limit });
  }
  findOne(username: string): Promise<any> {
    return this.userRepository.findOneBy({ username });
  }
  create(userObj: any): Promise<any> {
    return this.userRepository.save(userObj);
  }
  update(userObj: any): Promise<any> {
    return this.userRepository.update({ id: userObj.id }, userObj);
  }
  delete(id: string): Promise<any> {
    return this.userRepository.delete(id);
  }
}
