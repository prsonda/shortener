import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../../presentation/dto/jwt-payload.dto';
import { AuthGenerateTokenUseCase } from './auth-generate-token.use-case';

describe('AuthGenerateTokenUseCase', () => {
  let useCase: AuthGenerateTokenUseCase;
  let jwtService: jest.Mocked<JwtService>;

  const mockPayload: JwtPayloadDto = {
    sub: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    email: 'john.doe@example.com',
  };

  const mockToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTEzZGU3YS0xMjIxLTRkYjgtODRkNi1kN2EyMzZkMTkyYWMiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsImlhdCI6MTc1MzkzNDU4NCwiZXhwIjoxNzUzOTM4MTg0fQ.hZxwvq6F64qiQj9IQTkj-UdRVTGDMdKZKsbmW6siHpE';

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    useCase = new AuthGenerateTokenUseCase(jwtService);
  });

  it('should return access token', async () => {
    jwtService.sign.mockReturnValue(mockToken);

    const result = await useCase.execute(mockPayload);

    expect(jwtService.sign).toHaveBeenCalledWith(mockPayload);
    expect(result).toEqual({ access_token: mockToken });
  });
});
