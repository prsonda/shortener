import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class UserFindByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }
}
