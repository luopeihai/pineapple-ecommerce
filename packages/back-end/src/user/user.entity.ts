// import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
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
export class User extends BaseEntity {
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
