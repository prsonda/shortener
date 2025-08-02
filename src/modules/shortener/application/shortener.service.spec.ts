import { DateTime } from 'luxon';
import { ShortFilterDto } from '../presentation/dto/short-filter.dto';
import { ShortUrlCreateDto } from '../presentation/dto/short-url-create.dto';
import { ShortUrlResponseDto } from '../presentation/dto/short-url-response.dto';
import { ShortUrlUpadateDto } from '../presentation/dto/short-url-update.dto';
import { ShortenerResponseAllDto } from '../presentation/dto/shortener-response-all.dto';
import { ShortenerResponseDto } from '../presentation/dto/shortener-response.dto';
import { ShortenerService } from './shortener.service';
import { ShortenerCreateUseCase } from './use-cases/shortener-create.use-case';
import { ShortenerDeleteUseCase } from './use-cases/shortener-delete.use-case';
import { ShortenerFindByCodeUseCase } from './use-cases/shortener-find-by-code.use-case';
import { ShortenerFindByUserUseCase } from './use-cases/shortener-find-by-user.use-case';
import { ShortenerUpdateClickUseCase } from './use-cases/shortener-update-click.use-case';
import { ShortenerUpdateUseCase } from './use-cases/shortener-update.use-case';

describe('ShortenerService', () => {
  let service: ShortenerService;

  let mockCreateUseCase: jest.Mocked<ShortenerCreateUseCase>;
  let mockFindByCodeUseCase: jest.Mocked<ShortenerFindByCodeUseCase>;
  let mockFindByUserUseCase: jest.Mocked<ShortenerFindByUserUseCase>;
  let mockUpdateUseCase: jest.Mocked<ShortenerUpdateUseCase>;
  let mockUpdateClickUseCase: jest.Mocked<ShortenerUpdateClickUseCase>;
  let mockDeleteUseCase: jest.Mocked<ShortenerDeleteUseCase>;

  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  const mockCreateDto: ShortUrlCreateDto = {
    originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
  };

  const mockUpdateDto: ShortUrlUpadateDto = {
    originalUrl: mockCreateDto.originalUrl,
  };

  const mockUrlResponse: ShortUrlResponseDto = {
    url: 'https://novo-link.com/abc123',
  };

  const mockFilterDto: ShortFilterDto = {
    page: 1,
    limit: 10,
  };

  const mockResponseItem: ShortenerResponseDto = {
    id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
    userId: mockUserId,
    originalUrl: mockCreateDto.originalUrl,
    shortCode: mockShortCode,
    clicks: 0,
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    deletedAt: null,
  };

  const mockResponseAll: ShortenerResponseAllDto = {
    page: 1,
    limit: 10,
    totalItens: 1,
    totalPages: 1,
    data: [mockResponseItem],
  };

  beforeEach(() => {
    mockCreateUseCase = { execute: jest.fn() } as any;
    mockFindByCodeUseCase = { execute: jest.fn() } as any;
    mockFindByUserUseCase = { execute: jest.fn() } as any;
    mockUpdateUseCase = { execute: jest.fn() } as any;
    mockUpdateClickUseCase = { execute: jest.fn() } as any;
    mockDeleteUseCase = { execute: jest.fn() } as any;

    service = new ShortenerService(
      mockCreateUseCase,
      mockFindByCodeUseCase,
      mockUpdateUseCase,
      mockUpdateClickUseCase,
      mockFindByUserUseCase,
      mockDeleteUseCase,
    );
  });

  it('should create short URL', async () => {
    mockCreateUseCase.execute.mockResolvedValue(mockUrlResponse);

    const result = await service.create(mockCreateDto, mockUserId);

    expect(result).toEqual(mockUrlResponse);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(
      mockCreateDto,
      mockUserId,
    );
  });

  it('should find short URL by shortCode', async () => {
    mockFindByCodeUseCase.execute.mockResolvedValue(mockResponseItem);

    const result = await service.findByShortCode(mockShortCode, mockUserId);

    expect(result).toEqual(mockResponseItem);
    expect(mockFindByCodeUseCase.execute).toHaveBeenCalledWith(
      mockShortCode,
      mockUserId,
    );
  });

  it('should find short URLs by user', async () => {
    mockFindByUserUseCase.execute.mockResolvedValue(mockResponseAll);

    const result = await service.findByUser(mockUserId, mockFilterDto);

    expect(result).toEqual(mockResponseAll);
    expect(mockFindByUserUseCase.execute).toHaveBeenCalledWith(
      mockUserId,
      mockFilterDto,
    );
  });

  it('should update short URL', async () => {
    mockUpdateUseCase.execute.mockResolvedValue(mockUrlResponse);

    const result = await service.update(
      mockUserId,
      mockShortCode,
      mockUpdateDto,
    );

    expect(result).toEqual(mockUrlResponse);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith(
      mockUserId,
      mockShortCode,
      mockUpdateDto,
    );
  });

  it('should remove short URL', async () => {
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    await service.remove(mockUserId, mockShortCode);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith(
      mockUserId,
      mockShortCode,
      true,
    );
  });

  it('should increment clicks', async () => {
    mockUpdateClickUseCase.execute.mockResolvedValue(undefined);

    await service.incrementClicks(mockShortCode);

    expect(mockUpdateClickUseCase.execute).toHaveBeenCalledWith(mockShortCode);
  });
});
