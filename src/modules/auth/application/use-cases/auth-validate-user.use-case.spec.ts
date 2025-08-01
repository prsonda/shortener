import { UserService } from '@/modules/user/application/user.service';
import { BcryptService } from '../../infrastructure/bcrypt.service';
import { AuthValidateUserUseCase } from './auth-validate-user.use-case';

describe('AuthValidateUserUseCase', () => {
  let useCase: AuthValidateUserUseCase;
  let bcryptService: Partial<BcryptService>;
  let userService: Partial<UserService>;

  const originalPassword = 'Jmc@459f2';
  const mockHashed = 'hashedPassword';
  const mockWrongHashed = 'wrongpassword';

  const mockUser = {
    id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: mockHashed,
    deletedAt: null,
  };

  const mockUserDeleted = {
    ...mockUser,
    deletedAt: new Date(),
  };

  const mockUserResponse = {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
  };

  beforeEach(() => {
    bcryptService = {
      compare: jest.fn(),
    };
    userService = {
      findByEmail: jest.fn(),
    };
    useCase = new AuthValidateUserUseCase(
      bcryptService as BcryptService,
      userService as UserService,
    );
  });

  it('should return user data if email and password are valid', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcryptService.compare as jest.Mock).mockResolvedValue(true);

    const result = await useCase.execute(mockUser.email, originalPassword);

    expect(userService.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(bcryptService.compare).toHaveBeenCalledWith(
      originalPassword,
      mockHashed,
    );
    expect(result).toEqual(mockUserResponse);
  });

  it('should return null if user is not found', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);

    const result = await useCase.execute(mockUser.email, originalPassword);

    expect(result).toBeNull();
  });

  it('should return null if user is deleted', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUserDeleted);

    const result = await useCase.execute(mockUser.email, originalPassword);

    expect(result).toBeNull();
  });

  it('should return null if password does not match', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcryptService.compare as jest.Mock).mockResolvedValue(false);

    const result = await useCase.execute(mockUser.email, mockWrongHashed);

    expect(result).toBeNull();
  });
});
