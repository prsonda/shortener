import { BASE_URL } from '@/shared/config/env.provider';
import { DateTime } from 'luxon';
import { ShortCodeGeneratorService } from '../../domain/services/short-code-generator.service';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortUrlCreateDto } from '../../presentation/dto/short-url-create.dto';
import { ShortenerCreateUseCase } from './shortener-create.use-case';

jest.mock('../../domain/services/short-code-generator.service');

describe('ShortenerCreateUseCase', () => {
  let useCase: ShortenerCreateUseCase;
  let repo: jest.Mocked<ShortenerRepository>;
  let shortCodeGeneratorMock: jest.Mocked<ShortCodeGeneratorService>;

  const now = DateTime.now();
  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  const mockCreate: ShortUrlCreateDto = {
    originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
  };

  const mockResponseItem = {
    userId: mockUserId,
    originalUrl: mockCreate.originalUrl,
    shortCode: mockShortCode,
    clicks: 0,
    deletedAt: null,
  };

  beforeEach(() => {
    repo = {
      create: jest.fn().mockResolvedValue({}),
    } as any;

    shortCodeGeneratorMock = {
      generateUniqueShortCode: jest.fn().mockResolvedValue(mockShortCode),
    } as any;

    (ShortCodeGeneratorService as any).mockImplementation(
      () => shortCodeGeneratorMock,
    );

    jest.spyOn(DateTime, 'now').mockReturnValue(now);

    useCase = new ShortenerCreateUseCase(repo);
  });

  it('should create shortened URL with userId', async () => {
    const result = await useCase.execute(mockCreate, mockUserId);

    expect(shortCodeGeneratorMock.generateUniqueShortCode).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining(mockResponseItem),
    );
    expect(result).toEqual({ url: `${BASE_URL}/${mockShortCode}` });
  });

  it('should create shortened URL with null userId', async () => {
    await useCase.execute(mockCreate);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: null,
      }),
    );
  });
});
