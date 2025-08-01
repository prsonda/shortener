import { UserEntity } from '../../domain/user.entity';

export class UserMapper {
  static toEntity(data: any): UserEntity {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    };
  }
}
