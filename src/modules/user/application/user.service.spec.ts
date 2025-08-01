import { ErrorMessages } from '@/shared/constants/messages';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { UserCreateUseCase } from './use-cases/user-create.use-case';
import { UserFindByEmailUseCase } from './use-cases/user-find-by-email.use-case';
import { UserFindByIdUseCase } from './use-cases/user-find-by-id.use-case';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  let mockCreateUseCase: jest.Mocked<UserCreateUseCase>;
  let mockFindByIdUseCase: jest.Mocked<UserFindByIdUseCase>;
  let mockFindByEmailUseCase: jest.Mocked<UserFindByEmailUseCase>;

  const mockUser = {
    id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Jmc@459f2',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserCreate = {
    name: mockUser.name,
    email: mockUser.email,
    password: mockUser.password,
  };

  const mockUserResponse = {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
  };

  const mockUserIdNotFound = 'e913de7a-1331-4db8-84d6-d7a236d192ac';

  beforeEach(() => {
    mockCreateUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UserCreateUseCase>;

    mockFindByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UserFindByIdUseCase>;

    mockFindByEmailUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UserFindByEmailUseCase>;

    service = new UserService(
      mockCreateUseCase,
      mockFindByIdUseCase,
      mockFindByEmailUseCase,
    );
  });

  it('should return user registration', async () => {
    mockCreateUseCase.execute.mockResolvedValue(mockUser);

    const result = await service.create(mockUserCreate);

    expect(result).toEqual(mockUserResponse);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(mockUserCreate);
  });

  it('should return user by id', async () => {
    mockFindByIdUseCase.execute.mockResolvedValue(mockUser);

    const result = await service.findById(mockUser.id, mockUser.id);

    expect(result).toEqual(mockUserResponse);
    expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith(mockUser.id);
  });

  it('should return user by email', async () => {
    mockFindByEmailUseCase.execute.mockResolvedValue(mockUser);

    const result = await service.findByEmail(mockUser.email);

    expect(result).toEqual(mockUser);
    expect(mockFindByEmailUseCase.execute).toHaveBeenCalledWith(mockUser.email);
  });

  it('should return null if user not found', async () => {
    mockFindByIdUseCase.execute.mockResolvedValue(null);

    const result = await service.findById(mockUser.id, mockUser.id);

    expect(result).toBeNull();
    expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith(mockUser.id);
  });

  it('should return null if user not found by email', async () => {
    mockFindByEmailUseCase.execute.mockResolvedValue(null);

    const result = await service.findByEmail(mockUser.email);

    expect(result).toBeNull();
    expect(mockFindByEmailUseCase.execute).toHaveBeenCalledWith(mockUser.email);
  });

  it('should throw ConflictException if user already exists', async () => {
    mockFindByEmailUseCase.execute.mockResolvedValue(mockUser);

    await expect(service.create(mockUserCreate)).rejects.toThrow(
      ConflictException,
    );
    await expect(service.create(mockUserCreate)).rejects.toThrow(
      ErrorMessages.conflict,
    );
  });

  it('should return null if user is not owner', async () => {
    mockFindByIdUseCase.execute.mockResolvedValue(mockUser);

    await expect(
      service.findById(mockUserIdNotFound, mockUser.id),
    ).rejects.toThrow(ForbiddenException);
    expect(mockFindByIdUseCase.execute).not.toHaveBeenCalled();
  });
});
