import { DateTime } from 'luxon';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortFilterDto } from '../../presentation/dto/short-filter.dto';
import { ShortenerResponseAllDto } from '../../presentation/dto/shortener-response-all.dto';
import { ShortenerFindByUserUseCase } from './shortener-find-by-user.use-case';

describe('ShortenerFindByUserUseCase', () => {
  let useCase: ShortenerFindByUserUseCase;
  let repo: jest.Mocked<ShortenerRepository>;

  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  const mockResponseItem: ShortenerResponseAllDto = {
    page: 1,
    limit: 10,
    totalItens: 1,
    totalPages: 1,
    data: [
      {
        id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
        userId: mockUserId,
        originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
        shortCode: mockShortCode,
        clicks: 0,
        createdAt: DateTime.now().toJSDate(),
        updatedAt: DateTime.now().toJSDate(),
        deletedAt: null,
      },
    ],
  };

  const mockFilter: ShortFilterDto = {
    page: 1,
    limit: 10,
  };

  beforeEach(() => {
    repo = {
      findByUser: jest.fn().mockResolvedValue([mockResponseItem]),
    } as any;

    useCase = new ShortenerFindByUserUseCase(repo);
  });

  it('should return list of shortened URLs for the user', async () => {
    const result = await useCase.execute(mockUserId, mockFilter);

    expect(repo.findByUser).toHaveBeenCalledWith(mockUserId, mockFilter);
    expect(result).toEqual([mockResponseItem]);
  });
});
