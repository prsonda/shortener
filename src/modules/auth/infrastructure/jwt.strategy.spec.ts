import { JwtPayloadDto } from '../presentation/dto/jwt-payload.dto';
import { JwtStrategy } from './jwt.strategy';

jest.mock('@/shared/config/env.provider', () => ({
  JWT_SECRET: 'test_secret',
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockPayloadFromToken = {
    sub: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    email: 'john.doe@example.com',
  };

  const expectedValidatedUser = {
    userId: mockPayloadFromToken.sub,
    email: mockPayloadFromToken.email,
  };

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should validate and return user data', async () => {
    const payload: JwtPayloadDto = mockPayloadFromToken;
    const result = await strategy.validate(payload);
    expect(result).toEqual(expectedValidatedUser);
  });
});
