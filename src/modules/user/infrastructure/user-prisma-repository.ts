import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ErrorMessages } from '@/shared/constants/messages';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserMapper } from '../application/mappers/user.mapper';
import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: UserEntity): Promise<UserEntity> {
    try {
      const createdUser = await this.prismaService.user.create({
        data,
      });

      return UserMapper.toEntity(createdUser);
    } catch (error) {
      throw new InternalServerErrorException(ErrorMessages.internal, {
        cause: error,
      });
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) return null;

      return UserMapper.toEntity(user);
    } catch (error) {
      throw new InternalServerErrorException(ErrorMessages.internal, {
        cause: error,
      });
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return null;

      return UserMapper.toEntity(user);
    } catch (error) {
      throw new InternalServerErrorException(ErrorMessages.internal, {
        cause: error,
      });
    }
  }
}
