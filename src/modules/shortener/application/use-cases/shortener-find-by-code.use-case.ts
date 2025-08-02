import { Injectable } from '@nestjs/common';
import { ShortenerResponseDto } from '../../presentation/dto/shortener-response.dto';
import { ShortenerHelper } from '../helpers/shortener.helper';

@Injectable()
export class ShortenerFindByCodeUseCase {
  constructor(private readonly shortenerHelper: ShortenerHelper) {}

  async execute(
    shortCode: string,
    userId?: string,
  ): Promise<ShortenerResponseDto> {
    const shortUrl = await this.shortenerHelper.getOwnedShortCodeOrFail(
      shortCode,
      userId,
    );

    return shortUrl;
  }
}
