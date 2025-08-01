import { AuthService } from '@/modules/auth/application/auth.service';
import { AuthGenerateTokenUseCase } from '@/modules/auth/application/use-cases/auth-generate-token.use-case';
import { AuthValidateUserUseCase } from '@/modules/auth/application/use-cases/auth-validate-user.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UserService } from '../application/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: Partial<UserService>;

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Jmc@459f2',
  };

  const mockUserResponse = {
    user: {
      id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
      name: mockUser.name,
      email: mockUser.email,
    },
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTEzZGU3YS0xMjIxLTRkYjgtODRkNi1kN2EyMzZkMTkyYWMiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsImlhdCI6MTc1MzkzNDU4NCwiZXhwIjoxNzUzOTM4MTg0fQ.hZxwvq6F64qiQj9IQTkj-UdRVTGDMdKZKsbmW6siHpE',
  };

  beforeEach(async () => {
    userService = {
      create: jest.fn().mockResolvedValue(mockUserResponse.user),
      findById: jest.fn().mockResolvedValue(mockUserResponse.user),
    };

    const mockAuthGenerateTokenUseCase = {
      execute: jest
        .fn()
        .mockResolvedValue({ access_token: mockUserResponse.access_token }),
    };

    const mockAuthValidateUserUseCase = {
      execute: jest.fn().mockResolvedValue(mockUserResponse.user),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        {
          provide: AuthGenerateTokenUseCase,
          useValue: mockAuthGenerateTokenUseCase,
        },
        {
          provide: AuthValidateUserUseCase,
          useValue: mockAuthValidateUserUseCase,
        },
        AuthService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should return user registration', async () => {
    const user = await userController.create(mockUser);
    expect(user).toEqual(mockUserResponse);
    expect(userService.create).toHaveBeenCalledWith(mockUser);
  });

  it('should return user by id', async () => {
    const mockReq = {
      user: { userId: mockUserResponse.user.id },
    } as Request & { user: { userId: string } };

    const user = await userController.findById(
      mockReq,
      mockUserResponse.user.id,
    );
    expect(user).toEqual(mockUserResponse.user);
    expect(userService.findById).toHaveBeenCalledWith(
      mockUserResponse.user.id,
      mockUserResponse.user.id,
    );
  });
});
