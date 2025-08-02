import { ExecutionContext } from '@nestjs/common';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';

describe('OptionalJwtAuthGuard', () => {
  let guard: OptionalJwtAuthGuard;

  beforeEach(() => {
    guard = new OptionalJwtAuthGuard();
  });

  it('should return user if present', () => {
    const user = { id: 'e913de7a-1221-4db8-84d6-d7a236d192ac' };
    const result = guard.handleRequest(
      null,
      user,
      null,
      {} as ExecutionContext,
    );
    expect(result).toBe(user);
  });

  it('should return null if user is missing', () => {
    const result = guard.handleRequest(
      null,
      null,
      null,
      {} as ExecutionContext,
    );
    expect(result).toBeNull();
  });
});
