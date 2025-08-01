import { DateTime } from 'luxon';
import { UserEntity } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { UserFindByIdUseCase } from './user-find-by-id.use-case';

describe('UserFindByIdUseCase', () => {
  let useCase: UserFindByIdUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser: UserEntity = {
    id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Jmc@459f2',
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    deletedAt: null,
  };

  const mockUserIdNotFound = 'e913de7a-1331-4db8-84d6-d7a236d192ac';

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    useCase = new UserFindByIdUseCase(userRepository);
  });

  it('should return a user if found', async () => {
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute(mockUser.id);

    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(mockUser);
  });

  it('should return null if user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(mockUserIdNotFound);

    expect(result).toBeNull();
  });
});
