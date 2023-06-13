import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { getUserDto } from './dto/get-user.dto';
// import {BaseTransaction} from "../common/typeorm/BaseTransaction"


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
    private dataSource: DataSource
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
    const createUser = Object.assign(new User(), user)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 查询是否有该用户
      const hasUser = await queryRunner.manager.findOneBy("user", { username: user.username })
      if (hasUser) throw new HttpException("该用户已存在", 500);
      // 对用户密码使用argon2加密
      user.password = await argon2.hash(user.password || '');

      const newUser = await queryRunner.manager.save(createUser)

      // // 创建profile 信息
      const profile = Object.assign(new Profile(), {
        gender: 1,
        photo: 'https://1111',
        address: "",
        user: newUser
      })
      await queryRunner.manager.save(profile)
      await queryRunner.commitTransaction();
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, 500);
    } finally {
      await queryRunner.release();
    }

  }

  async remove(id: number) {
    // return this.userRepository.delete(id);
    // const user = await this.findOne(id);
    return this.userRepository.createQueryBuilder('user').where("user.id = :id", { id }).softDelete().execute()
  }
}
