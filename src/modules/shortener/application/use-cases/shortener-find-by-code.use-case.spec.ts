import { DateTime } from 'luxon';
import { ShortenerResponseDto } from '../../presentation/dto/shortener-response.dto';
import { ShortenerHelper } from '../helpers/shortener.helper';
import { ShortenerFindByCodeUseCase } from './shortener-find-by-code.use-case';

describe('ShortenerFindByCodeUseCase', () => {
  let useCase: ShortenerFindByCodeUseCase;
  let helper: jest.Mocked<ShortenerHelper>;

  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  const mockResponseItem: ShortenerResponseDto = {
    id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
    userId: mockUserId,
    originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
    shortCode: mockShortCode,
    clicks: 0,
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    deletedAt: null,
  };

  beforeEach(() => {
    helper = {
      getOwnedShortCodeOrFail: jest.fn().mockResolvedValue(mockResponseItem),
    } as any;

    useCase = new ShortenerFindByCodeUseCase(helper);
  });

  it('should return shortener data with userId', async () => {
    const result = await useCase.execute(mockShortCode, mockUserId);
    expect(helper.getOwnedShortCodeOrFail).toHaveBeenCalledWith(
      mockShortCode,
      mockUserId,
    );
    expect(result).toEqual(mockResponseItem);
  });

  it('should return shortener data without userId', async () => {
    const result = await useCase.execute(mockShortCode);
    expect(helper.getOwnedShortCodeOrFail).toHaveBeenCalledWith(
      mockShortCode,
      undefined,
    );
    expect(result).toEqual(mockResponseItem);
  });
});
