import { ErrorMessages } from '@/shared/constants/messages';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortenerResponseDto } from '../../presentation/dto/shortener-response.dto';
import { ShortenerHelper } from './shortener.helper';

describe('ShortenerHelper', () => {
  let helper: ShortenerHelper;
  let repo: jest.Mocked<ShortenerRepository>;

  const shortCode = 'abc123';
  const userId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';
  const mockNotOwner = 'e913de7a-1331-4db8-84d6-d7a236d192ac';

  const mockResponseItem: ShortenerResponseDto = {
    id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
    userId: userId,
    originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
    shortCode: shortCode,
    clicks: 1,
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    deletedAt: null,
  };

  beforeEach(() => {
    repo = {
      findByShortCode: jest.fn(),
    } as unknown as jest.Mocked<ShortenerRepository>;

    helper = new ShortenerHelper(repo);
  });

  it('should return item if found and userId matches or not provided', async () => {
    repo.findByShortCode.mockResolvedValue(mockResponseItem);

    await expect(helper.getOwnedShortCodeOrFail(shortCode)).resolves.toEqual(
      mockResponseItem,
    );

    await expect(
      helper.getOwnedShortCodeOrFail(shortCode, userId),
    ).resolves.toEqual(mockResponseItem);
  });

  it('should throw NotFoundException if item not found', async () => {
    repo.findByShortCode.mockResolvedValue(null);

    await expect(helper.getOwnedShortCodeOrFail('unknown')).rejects.toThrow(
      new NotFoundException(ErrorMessages.notFound),
    );
  });

  it('should throw ForbiddenException if userId provided and does not match', async () => {
    repo.findByShortCode.mockResolvedValue(mockResponseItem);

    await expect(
      helper.getOwnedShortCodeOrFail(shortCode, mockNotOwner),
    ).rejects.toThrow(new ForbiddenException(ErrorMessages.forbidden));
  });
});
