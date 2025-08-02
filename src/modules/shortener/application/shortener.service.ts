import { Injectable } from '@nestjs/common';
import { ShortFilterDto } from '../presentation/dto/short-filter.dto';
import { ShortUrlCreateDto } from '../presentation/dto/short-url-create.dto';
import { ShortUrlResponseDto } from '../presentation/dto/short-url-response.dto';
import { ShortUrlUpadateDto } from '../presentation/dto/short-url-update.dto';
import { ShortenerResponseAllDto } from '../presentation/dto/shortener-response-all.dto';
import { ShortenerResponseDto } from '../presentation/dto/shortener-response.dto';
import { ShortenerCreateUseCase } from './use-cases/shortener-create.use-case';
import { ShortenerDeleteUseCase } from './use-cases/shortener-delete.use-case';
import { ShortenerFindByCodeUseCase } from './use-cases/shortener-find-by-code.use-case';
import { ShortenerFindByUserUseCase } from './use-cases/shortener-find-by-user.use-case';
import { ShortenerUpdateClickUseCase } from './use-cases/shortener-update-click.use-case';
import { ShortenerUpdateUseCase } from './use-cases/shortener-update.use-case';

@Injectable()
export class ShortenerService {
  constructor(
    private readonly shortenerCreateUseCase: ShortenerCreateUseCase,
    private readonly shortenerFindByCodeUseCase: ShortenerFindByCodeUseCase,
    private readonly shortenerUpdateUseCase: ShortenerUpdateUseCase,
    private readonly shortenerUpdateClickUseCase: ShortenerUpdateClickUseCase,
    private readonly shortenerFindByUserUseCase: ShortenerFindByUserUseCase,
    private readonly shortenerDeleteUseCase: ShortenerDeleteUseCase,
  ) {}

  async create(
    shortUrlCreateDto: ShortUrlCreateDto,
    userId?: string,
  ): Promise<ShortUrlResponseDto> {
    return this.shortenerCreateUseCase.execute(shortUrlCreateDto, userId);
  }

  async findByShortCode(
    shortCode: string,
    userId?: string,
  ): Promise<ShortenerResponseDto> {
    return this.shortenerFindByCodeUseCase.execute(shortCode, userId);
  }

  async findByUser(
    userId: string,
    filter: ShortFilterDto,
  ): Promise<ShortenerResponseAllDto> {
    return this.shortenerFindByUserUseCase.execute(userId, filter);
  }

  async update(
    userId: string,
    shortCode: string,
    shortUrlUpadateDto: ShortUrlUpadateDto,
  ): Promise<ShortUrlResponseDto> {
    return this.shortenerUpdateUseCase.execute(
      userId,
      shortCode,
      shortUrlUpadateDto,
    );
  }

  async remove(userId: string, shortCode: string): Promise<void> {
    return this.shortenerDeleteUseCase.execute(userId, shortCode, true);
  }

  async incrementClicks(shortCode: string): Promise<void> {
    return this.shortenerUpdateClickUseCase.execute(shortCode);
  }
}
