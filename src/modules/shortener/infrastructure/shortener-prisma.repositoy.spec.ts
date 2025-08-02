import { InternalServerErrorException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ShortenerMapper } from '../application/mappers/shortener.mapper';
import { ShortenerEntity } from '../domain/entities/shortener.entity';
import { ShortenerPrismaRepository } from './shortener-prisma.repositoy';

jest.mock('../application/mappers/shortener.mapper');

describe('ShortenerPrismaRepository', () => {
  let repo: ShortenerPrismaRepository;
  let prismaService: any;

  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  const mockEntity: ShortenerEntity = {
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
    prismaService = {
      url: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
    };

    repo = new ShortenerPrismaRepository(prismaService);
    (ShortenerMapper.toEntity as jest.Mock).mockImplementation((x) => x);
  });

  describe('create', () => {
    it('should call prisma create with entity data', async () => {
      prismaService.url.create.mockResolvedValue(mockEntity);

      await repo.create(mockEntity);

      expect(prismaService.url.create).toHaveBeenCalledWith({
        data: mockEntity,
      });
    });

    it('should throw InternalServerErrorException on prisma error', async () => {
      prismaService.url.create.mockRejectedValue(new Error('fail'));

      await expect(repo.create(mockEntity)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prismaService.url.create).toHaveBeenCalled();
    });
  });

  describe('findByShortCode', () => {
    it('should return mapped entity when found', async () => {
      prismaService.url.findFirst.mockResolvedValue(mockEntity);

      const result = await repo.findByShortCode(mockShortCode);

      expect(prismaService.url.findFirst).toHaveBeenCalledWith({
        where: { shortCode: mockShortCode, deletedAt: null },
      });
      expect(result).toEqual(mockEntity);
    });

    it('should return null when not found', async () => {
      prismaService.url.findFirst.mockResolvedValue(null);

      const result = await repo.findByShortCode(mockShortCode);

      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException on prisma error', async () => {
      prismaService.url.findFirst.mockRejectedValue(new Error('fail'));

      await expect(repo.findByShortCode(mockShortCode)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findByUser', () => {
    const filter = {
      page: 2,
      limit: 5,
      search: 'abc',
      createdFrom: '2025-01-01',
      createdTo: '2025-01-10',
      minClicks: 1,
      maxClicks: 10,
    };

    it('should return paginated result with mapped data', async () => {
      prismaService.url.findMany.mockResolvedValue([mockEntity]);
      prismaService.url.count.mockResolvedValue(1);

      const result = await repo.findByUser(mockUserId, filter);

      expect(prismaService.url.findMany).toHaveBeenCalled();
      expect(prismaService.url.count).toHaveBeenCalled();

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalItens).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.data).toEqual([mockEntity]);
    });

    it('should throw InternalServerErrorException on prisma error', async () => {
      prismaService.url.findMany.mockRejectedValue(new Error('fail'));

      await expect(repo.findByUser(mockUserId, filter)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should call prisma update with entity data', async () => {
      prismaService.url.update.mockResolvedValue(mockEntity);

      await repo.update(mockEntity);

      expect(prismaService.url.update).toHaveBeenCalledWith({
        where: { id: mockEntity.id },
        data: mockEntity,
      });
    });

    it('should throw InternalServerErrorException on prisma error', async () => {
      prismaService.url.update.mockRejectedValue(new Error('fail'));

      await expect(repo.update(mockEntity)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
