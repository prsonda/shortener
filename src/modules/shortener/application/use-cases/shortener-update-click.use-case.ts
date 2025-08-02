import { Injectable } from '@nestjs/common';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortenerHelper } from '../helpers/shortener.helper';

@Injectable()
export class ShortenerUpdateClickUseCase {
  constructor(
    private readonly shortenerRepository: ShortenerRepository,
    private readonly shortenerHelper: ShortenerHelper,
  ) {}

  async execute(shortCode: string): Promise<void> {
    const existing =
      await this.shortenerHelper.getOwnedShortCodeOrFail(shortCode);

    existing.clicks++;

    await this.shortenerRepository.update(existing);
  }
}
