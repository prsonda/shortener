import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<AuthService>;

  const mockAuthLogin = {
    email: 'john.doe@example.com',
    password: 'Jmc@459f2',
  };

  const mockAuthLoginResponse = {
    user: {
      id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
      name: 'John Doe',
      email: mockAuthLogin.email,
    },
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTEzZGU3YS0xMjIxLTRkYjgtODRkNi1kN2EyMzZkMTkyYWMiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsImlhdCI6MTc1MzkzNDU4NCwiZXhwIjoxNzUzOTM4MTg0fQ.hZxwvq6F64qiQj9IQTkj-UdRVTGDMdKZKsbmW6siHpE',
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue(mockAuthLoginResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should call authService.login with correct parameters', async () => {
    const result = await authController.login(mockAuthLogin);
    expect(authService.login).toHaveBeenCalledWith(mockAuthLogin);
    expect(result).toEqual(mockAuthLoginResponse);
  });

  it('must call authService.login with incorrect parameters', async () => {
    authService.login = jest
      .fn()
      .mockRejectedValue(new UnauthorizedException());
    await expect(authController.login(mockAuthLogin)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
