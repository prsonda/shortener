import { DateTime } from 'luxon';
import { UserEntity } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { UserFindByEmailUseCase } from './user-find-by-email.use-case';

describe('UserFindByEmailUseCase', () => {
  let useCase: UserFindByEmailUseCase;
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

  const mockUserEmailNotFound = 'john.doe-1@example.com';

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    useCase = new UserFindByEmailUseCase(userRepository);
  });

  it('should return a user if found', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await useCase.execute(mockUser.email);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(result).toEqual(mockUser);
  });

  it('should return null if user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute(mockUserEmailNotFound);

    expect(result).toBeNull();
  });
});
