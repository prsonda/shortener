import { BASE_URL } from '@/shared/config/env.provider';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { ShortenerEntity } from '../../domain/entities/shortener.entity';
import { ShortCodeGeneratorService } from '../../domain/services/short-code-generator.service';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortUrlCreateDto } from '../../presentation/dto/short-url-create.dto';
import { ShortUrlResponseDto } from '../../presentation/dto/short-url-response.dto';

@Injectable()
export class ShortenerCreateUseCase {
  private readonly shortCodeGenerator: ShortCodeGeneratorService;

  constructor(private readonly shortenerRepository: ShortenerRepository) {
    this.shortCodeGenerator = new ShortCodeGeneratorService(
      shortenerRepository,
    );
  }

  async execute(
    dto: ShortUrlCreateDto,
    userId?: string,
  ): Promise<ShortUrlResponseDto> {
    const shortCode = await this.shortCodeGenerator.generateUniqueShortCode();
    const urlCreate = new ShortenerEntity();

    urlCreate.id = randomUUID();
    urlCreate.userId = userId ?? null;
    urlCreate.originalUrl = dto.originalUrl;
    urlCreate.shortCode = shortCode;
    urlCreate.clicks = 0;
    urlCreate.createdAt = DateTime.now().toJSDate();
    urlCreate.updatedAt = DateTime.now().toJSDate();
    urlCreate.deletedAt = null;

    await this.shortenerRepository.create(urlCreate);

    return { url: `${BASE_URL}/${shortCode}` };
  }
}
