import { Exclude, Expose } from 'class-transformer';


export class PublicUserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Exclude()
  password: string;
}
