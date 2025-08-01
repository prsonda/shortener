import { BcryptService } from '@/modules/auth/infrastructure/bcrypt.service';
import { ErrorMessages } from '@/shared/constants/messages';
import { InternalServerErrorException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { UserEntity } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { UserCreateDto } from '../../presentation/dto/user-create.dto';
import { UserCreateUseCase } from './user-create.use-case';

jest.mock('crypto', () => ({
  randomUUID: () => 'e913de7a-1221-4db8-84d6-d7a236d192ac',
}));

describe('UserCreateUseCase', () => {
  let useCase: UserCreateUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let bcryptService: jest.Mocked<BcryptService>;

  const mockUserDto: UserCreateDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Jmc@459f2',
  };

  const now = DateTime.now();

  const mockUser: UserEntity = {
    id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    name: mockUserDto.name,
    email: mockUserDto.email,
    password: 'hashedPassword',
    createdAt: now.toJSDate(),
    updatedAt: now.toJSDate(),
    deletedAt: null,
  };

  const mockHashed = 'hashedPassword';
  const mockHashedFailed = 'hashedPasswordFail';

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    bcryptService = {
      hash: jest.fn(),
    } as unknown as jest.Mocked<BcryptService>;

    jest.spyOn(DateTime, 'now').mockReturnValue(now);

    useCase = new UserCreateUseCase(userRepository, bcryptService);
  });

  it('should create user with hashed password and timestamps', async () => {
    bcryptService.hash.mockResolvedValue(mockHashed);

    userRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute(mockUserDto);

    expect(bcryptService.hash).toHaveBeenCalledWith(mockUserDto.password);
    expect(userRepository.create).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw if bcryptService.hash fails', async () => {
    bcryptService.hash.mockRejectedValue(
      new InternalServerErrorException(mockHashedFailed),
    );

    await expect(useCase.execute(mockUserDto)).rejects.toThrow(
      ErrorMessages.hash,
    );
  });

  it('should throw if userRepository.create fails', async () => {
    bcryptService.hash.mockResolvedValue(mockHashed);
    userRepository.create.mockRejectedValue(
      new InternalServerErrorException(ErrorMessages.internal),
    );

    await expect(useCase.execute(mockUserDto)).rejects.toThrow(
      ErrorMessages.internal,
    );
  });
});
