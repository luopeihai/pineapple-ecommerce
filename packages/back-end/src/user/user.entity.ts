// import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Generated
  // OneToMany,
  // ManyToMany,
  // JoinTable,
  // OneToOne,
  // AfterInsert,
  // AfterRemove,
} from 'typeorm';
// import { Logs } from 'src/logs/logs.entity';
// import { Roles } from 'src/roles/roles.entity';
// import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column({
    unique: true, type: "varchar",
    length: 150,
  })
  username: string;

  @Column({
    type: "varchar",
    length: 100
  })
  password: string;
}
