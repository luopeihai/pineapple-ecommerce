import { EntityManager, DataSource } from 'typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { BaseTransaction } from "../../common/typeorm/BaseTransaction"
import { User } from '../user.entity';
import { Profile } from "../profile.entity";

@Injectable()
export class CreateUserTransaction extends BaseTransaction<Partial<User>, User> {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    // the important thing here is to use the manager that we've created in the base class
    protected async execute(data: Partial<User>, manager: EntityManager): Promise<User> {
        // 查询是否有该用户
        const hasUser = await manager.findOneBy("user", { username: data.username })
        if (hasUser) throw new HttpException("该用户已存在", 500);

        data.password = await argon2.hash(data.password || '');
        const createUser = Object.assign(new User(), data)
        const newUser = await manager.save(createUser)
        const profile = Object.assign(new Profile(), {
            gender: 1,
            photo: 'https://1111',
            address: "",
            user: newUser
        })
        await manager.save(profile)
        return newUser
    }

}