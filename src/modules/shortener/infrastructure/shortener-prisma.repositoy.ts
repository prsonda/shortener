import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ErrorMessages } from '@/shared/constants/messages';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { ShortenerMapper } from '../application/mappers/shortener.mapper';
import { ShortenerEntity } from '../domain/entities/shortener.entity';
import { ShortenerRepository } from '../domain/shortener.repositoy';
import { ShortFilterDto } from '../presentation/dto/short-filter.dto';
import { ShortenerResponseAllDto } from '../presentation/dto/shortener-response-all.dto';

@Injectable()
export class ShortenerPrismaRepository implements ShortenerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(shortenerEntity: ShortenerEntity): Promise<void> {
    try {
      await this.prismaService.url.create({
        data: shortenerEntity,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ErrorMessages.internalWithItem('createShortCode'),
        {
          cause: error,
        },
      );
    }
  }

  async findByShortCode(shortCode: string): Promise<ShortenerEntity | null> {
    try {
      const where: Prisma.UrlWhereInput = {
        shortCode,
        deletedAt: null,
      };

      const url = await this.prismaService.url.findFirst({
        where,
      });

      if (!url) return null;

      return ShortenerMapper.toEntity(url);
    } catch (error) {
      throw new InternalServerErrorException(
        ErrorMessages.internalWithItem('findByShortCode'),
        {
          cause: error,
        },
      );
    }
  }

  async findByUser(
    userId: string,
    filter: ShortFilterDto,
  ): Promise<ShortenerResponseAllDto> {
    try {
      const where: Prisma.UrlWhereInput = {
        userId,
        deletedAt: null,
      };

      if (filter.search) {
        where.OR = [
          { originalUrl: { contains: filter.search, mode: 'insensitive' } },
          { shortCode: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const createdAt: Record<string, Date> = {};

      if (filter.createdFrom) {
        createdAt.gte = DateTime.fromISO(filter.createdFrom).toJSDate();
      }

      if (filter.createdTo) {
        createdAt.lt = DateTime.fromISO(filter.createdTo)
          .plus({ days: 1 })
          .startOf('day')
          .toJSDate();
      }

      if (Object.keys(createdAt).length > 0) {
        where.createdAt = createdAt;
      }

      const clicks: Record<string, number> = {};

      if (filter.maxClicks) {
        clicks.lte = filter.maxClicks;
      }

      if (filter.minClicks) {
        clicks.gte = filter.minClicks;
      }

      if (Object.keys(clicks).length > 0) {
        where.clicks = clicks;
      }

      const page = filter.page ?? 1;
      const limit = filter.limit ?? 10;

      const filterQuery: Prisma.UrlFindManyArgs = {
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      };

      const [urls, totalItens] = await Promise.all([
        this.prismaService.url.findMany(filterQuery),
        this.prismaService.url.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItens / limit);

      return {
        page: page,
        limit: limit,
        totalItens,
        totalPages,
        data: urls.map((url) => ShortenerMapper.toEntity(url)),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        ErrorMessages.internalWithItem('findByUserShortCode'),
        {
          cause: error,
        },
      );
    }
  }

  async update(shortenerEntity: ShortenerEntity): Promise<void> {
    try {
      await this.prismaService.url.update({
        where: {
          id: shortenerEntity.id,
        },
        data: shortenerEntity,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ErrorMessages.internalWithItem('updateShortCode'),
        {
          cause: error,
        },
      );
    }
  }
}
