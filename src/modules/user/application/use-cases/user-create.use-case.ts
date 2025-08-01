import { BcryptService } from '@/modules/auth/infrastructure/bcrypt.service';
import { ErrorMessages } from '@/shared/constants/messages';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { UserEntity } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { UserCreateDto } from '../../presentation/dto/user-create.dto';

@Injectable()
export class UserCreateUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(dto: UserCreateDto): Promise<UserEntity> {
    const user = new UserEntity();

    user.id = randomUUID();
    user.name = dto.name;
    user.email = dto.email;

    try {
      user.password = await this.bcryptService.hash(dto.password);
    } catch (error) {
      throw new InternalServerErrorException(ErrorMessages.hash);
    }

    user.createdAt = DateTime.now().toJSDate();
    user.updatedAt = DateTime.now().toJSDate();
    user.deletedAt = null;

    return await this.userRepository.create(user);
  }
}
