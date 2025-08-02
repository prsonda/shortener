import { BASE_URL } from '@/shared/config/env.provider';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortUrlResponseDto } from '../../presentation/dto/short-url-response.dto';
import { ShortUrlUpadateDto } from '../../presentation/dto/short-url-update.dto';
import { ShortenerHelper } from '../helpers/shortener.helper';

@Injectable()
export class ShortenerUpdateUseCase {
  constructor(
    private readonly shortenerRepository: ShortenerRepository,
    private readonly shortenerHelper: ShortenerHelper,
  ) {}

  async execute(
    userId: string,
    shortCode: string,
    dto: ShortUrlUpadateDto,
  ): Promise<ShortUrlResponseDto> {
    const existing = await this.shortenerHelper.getOwnedShortCodeOrFail(
      shortCode,
      userId,
    );

    if (dto.originalUrl) {
      existing.originalUrl = dto.originalUrl;
      existing.updatedAt = DateTime.now().toJSDate();
    }

    await this.shortenerRepository.update(existing);

    return { url: `${BASE_URL}/${existing.shortCode}` };
  }
}
