import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getUserDto } from './dto/get-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  findAll(query: getUserDto) {
    const { limit, page, username } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    // const obj = {
    //   'user.username like :name': username
    // };
    // .where("user.firstName like :name", { name:`%${firstName}%` })
    // inner join vs left join vs outer join
    const queryBuilder = this.userRepository
      .createQueryBuilder('user').where("user.username like :name", { name: `%${username}%` })
    // const newQuery = conditionUtils(queryBuilder, obj);
    // if (gender) {
    //   queryBuilder.andWhere('profile.gender = :gender', { gender });
    // } else {
    //   queryBuilder.andWhere('profile.gender IS NOT NULL');
    // }
    // if (role) {
    //   queryBuilder.andWhere('roles.id = :role', { role });
    // } else {
    //   queryBuilder.andWhere('roles.id IS NOT NULL');
    // }
    return (
      queryBuilder
        .take(take)
        .skip(skip)
        // .andWhere('profile.gender = :gender', { gender })
        // .andWhere('roles.id = :role', { role })
        .getMany()
    );
  }

  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.menus'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>) {
    // try {
    // 对用户密码使用argon2加密
    user.password = await argon2.hash(user.password || '');
    const res = await this.userRepository.create(user).save()
    return res;
    // } catch (error) {
    //   console.log(
    //     '🚀 ~ file: user.service.ts ~ line 93 ~ UserService ~ create ~ error',
    //     error,
    //   );
    //   if (error.errno && error.errno === 1062) {
    //     throw new HttpException(error.sqlMessage, 500);
    //   }
    // }

  }

  async remove(id: number) {
    // return this.userRepository.delete(id);
    // const user = await this.findOne(id);
    return this.userRepository.delete(id)
  }
}
