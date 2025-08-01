import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGenerateTokenUseCase } from './use-cases/auth-generate-token.use-case';
import { AuthValidateUserUseCase } from './use-cases/auth-validate-user.use-case';

describe('AuthService', () => {
  let service: AuthService;

  let mockAuthGenerateTokenUseCase: AuthGenerateTokenUseCase;
  let mockAuthValidateUserUseCase: AuthValidateUserUseCase;

  const mockLogin = {
    email: 'john.doe@example.com',
    password: 'Jmc@459f2',
  };

  const mockAuthResponse = {
    user: {
      id: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
      name: 'John Doe',
      email: mockLogin.email,
    },
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTEzZGU3YS0xMjIxLTRkYjgtODRkNi1kN2EyMzZkMTkyYWMiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsImlhdCI6MTc1MzkzNDU4NCwiZXhwIjoxNzUzOTM4MTg0fQ.hZxwvq6F64qiQj9IQTkj-UdRVTGDMdKZKsbmW6siHpE',
  };

  const mockPayload = {
    sub: mockAuthResponse.user.id,
    email: mockLogin.email,
  };

  beforeEach(async () => {
    mockAuthGenerateTokenUseCase = {
      execute: jest.fn(),
    } as unknown as AuthGenerateTokenUseCase;
    mockAuthValidateUserUseCase = {
      execute: jest.fn(),
    } as unknown as AuthValidateUserUseCase;

    service = new AuthService(
      mockAuthGenerateTokenUseCase,
      mockAuthValidateUserUseCase,
    );
  });
  it('should return user login', async () => {
    jest
      .spyOn(mockAuthValidateUserUseCase, 'execute')
      .mockResolvedValueOnce(mockAuthResponse.user);

    jest
      .spyOn(mockAuthGenerateTokenUseCase, 'execute')
      .mockResolvedValueOnce(mockAuthResponse);

    const result = await service.login(mockLogin);

    expect(result).toEqual(mockAuthResponse);
  });

  it('should throw BadRequestException if user is not found', async () => {
    jest
      .spyOn(mockAuthValidateUserUseCase, 'execute')
      .mockResolvedValueOnce(null);

    await expect(service.login(mockLogin)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return validation user', async () => {
    jest
      .spyOn(mockAuthValidateUserUseCase, 'execute')
      .mockResolvedValueOnce(mockAuthResponse.user);

    const result = await service.validateUser(mockLogin);

    expect(result).toEqual(mockAuthResponse.user);
  });

  it('should return generate token', async () => {
    jest
      .spyOn(mockAuthGenerateTokenUseCase, 'execute')
      .mockResolvedValueOnce(mockAuthResponse);

    const result = await service.generateToken(mockPayload);

    expect(result).toEqual(mockAuthResponse);
  });
});
