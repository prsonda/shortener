import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { UserMapper } from '../application/mappers/user.mapper';
import { UserEntity } from '../domain/user.entity';
import { UserPrismaRepository } from './user-prisma-repository';

jest.mock('../application/mappers/user.mapper');

describe('UserPrismaRepository', () => {
  let repository: UserPrismaRepository;
  let prisma: jest.Mocked<PrismaService>;

  const userDb = {
    id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Jmc@459f2',
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    deletedAt: null,
  };

  const userEntity: UserEntity = userDb;

  const mockNotFoundEmail = 'notfound@example.com';

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    (UserMapper.toEntity as jest.Mock).mockReturnValue(userEntity);

    repository = new UserPrismaRepository(prisma as PrismaService);
  });

  it('should create a user and return UserEntity', async () => {
    (prisma.user.create as jest.Mock).mockResolvedValue(userDb);

    const result = await repository.create(userEntity);

    expect(prisma.user.create).toHaveBeenCalledWith({ data: userEntity });
    expect(UserMapper.toEntity).toHaveBeenCalledWith(userDb);
    expect(result).toEqual(userEntity);
  });

  it('should return user by id', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userDb);

    const result = await repository.findById(userDb.id);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userDb.id },
    });
    expect(result).toEqual(userEntity);
  });

  it('should return user by email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userDb);

    const result = await repository.findByEmail(userDb.email);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: userDb.email },
    });
    expect(result).toEqual(userEntity);
  });

  it('should return null if user not found (email)', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await repository.findByEmail(mockNotFoundEmail);

    expect(result).toBeNull();
  });

  it('should throw error on create failure', async () => {
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error('fail'));

    await expect(repository.create(userEntity)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
