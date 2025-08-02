import { DateTime } from 'luxon';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortenerResponseDto } from '../../presentation/dto/shortener-response.dto';
import { ShortenerHelper } from '../helpers/shortener.helper';
import { ShortenerDeleteUseCase } from './shortener-delete.use-case';

describe('ShortenerDeleteUseCase', () => {
  let useCase: ShortenerDeleteUseCase;
  let repo: jest.Mocked<ShortenerRepository>;
  let helper: jest.Mocked<ShortenerHelper>;

  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  const existingShortener: ShortenerResponseDto = {
    id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
    userId: mockUserId,
    shortCode: mockShortCode,
    originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
    clicks: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    repo = {
      update: jest.fn(),
    } as any;

    helper = {
      getOwnedShortCodeOrFail: jest.fn(),
    } as any;

    useCase = new ShortenerDeleteUseCase(repo, helper);
  });

  it('should set deletedAt when deleted is true and update', async () => {
    helper.getOwnedShortCodeOrFail.mockResolvedValue(existingShortener);

    const now = new Date();
    jest.spyOn(DateTime, 'now').mockReturnValue({
      toJSDate: () => now,
    } as any);

    await useCase.execute(mockUserId, mockShortCode, true);

    expect(helper.getOwnedShortCodeOrFail).toHaveBeenCalledWith(
      mockShortCode,
      mockUserId,
    );
    expect(existingShortener.deletedAt).toEqual(now);
    expect(repo.update).toHaveBeenCalledWith(existingShortener);
  });
});
