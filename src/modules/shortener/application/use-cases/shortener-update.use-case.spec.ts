import { BASE_URL } from '@/shared/config/env.provider';
import { DateTime } from 'luxon';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortUrlUpadateDto } from '../../presentation/dto/short-url-update.dto';
import { ShortenerResponseDto } from '../../presentation/dto/shortener-response.dto';
import { ShortenerHelper } from '../helpers/shortener.helper';
import { ShortenerUpdateUseCase } from './shortener-update.use-case';

describe('ShortenerUpdateUseCase', () => {
  let useCase: ShortenerUpdateUseCase;
  let repo: jest.Mocked<ShortenerRepository>;
  let helper: jest.Mocked<ShortenerHelper>;

  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  let mockResponseItem: ShortenerResponseDto;

  beforeEach(() => {
    mockResponseItem = {
      id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
      userId: mockUserId,
      originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
      shortCode: mockShortCode,
      clicks: 0,
      createdAt: DateTime.now().toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      deletedAt: null,
    };

    repo = {
      update: jest.fn(),
    } as any;

    helper = {
      getOwnedShortCodeOrFail: jest.fn().mockResolvedValue(mockResponseItem),
    } as any;

    useCase = new ShortenerUpdateUseCase(repo, helper);
  });

  it('should update originalUrl and return new short URL', async () => {
    const dto: ShortUrlUpadateDto = {
      originalUrl: 'https://novo-link.com',
    };

    const result = await useCase.execute(mockUserId, mockShortCode, dto);

    expect(helper.getOwnedShortCodeOrFail).toHaveBeenCalledWith(
      mockShortCode,
      mockUserId,
    );
    expect(repo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        originalUrl: dto.originalUrl,
      }),
    );
    expect(result.url).toBe(`${BASE_URL}/${mockShortCode}`);
  });

  it('should not update if originalUrl is not provided', async () => {
    const dto: ShortUrlUpadateDto = {};

    const result = await useCase.execute(mockUserId, mockShortCode, dto);

    expect(helper.getOwnedShortCodeOrFail).toHaveBeenCalled();
    expect(repo.update).toHaveBeenCalledWith(mockResponseItem);
    expect(result.url).toBe(`${BASE_URL}/${mockShortCode}`);
  });
});
