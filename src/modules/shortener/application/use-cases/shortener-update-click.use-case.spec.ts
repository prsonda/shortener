import { DateTime } from 'luxon';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortenerResponseDto } from '../../presentation/dto/shortener-response.dto';
import { ShortenerHelper } from '../helpers/shortener.helper';
import { ShortenerUpdateClickUseCase } from './shortener-update-click.use-case';

describe('ShortenerUpdateClickUseCase', () => {
  let useCase: ShortenerUpdateClickUseCase;
  let repo: jest.Mocked<ShortenerRepository>;
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
    repo = {
      update: jest.fn(),
    } as any;

    helper = {
      getOwnedShortCodeOrFail: jest
        .fn()
        .mockResolvedValue({ ...mockResponseItem }),
    } as any;

    useCase = new ShortenerUpdateClickUseCase(repo, helper);
  });

  it('should increment clicks and update the shortener', async () => {
    await useCase.execute(mockShortCode);

    expect(helper.getOwnedShortCodeOrFail).toHaveBeenCalledWith(mockShortCode);
    expect(repo.update).toHaveBeenCalledWith(
      expect.objectContaining({ clicks: 1 }),
    );
  });
});
