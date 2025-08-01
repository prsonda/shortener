import { UserEntity } from './user.entity';

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
