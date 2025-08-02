import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortenerHelper } from '../helpers/shortener.helper';

@Injectable()
export class ShortenerDeleteUseCase {
  constructor(
    private readonly shortenerRepository: ShortenerRepository,
    private readonly shortenerHelper: ShortenerHelper,
  ) {}

  async execute(
    userId: string,
    shortCode: string,
    deleted: boolean,
  ): Promise<void> {
    const existing = await this.shortenerHelper.getOwnedShortCodeOrFail(
      shortCode,
      userId,
    );

    if (deleted) existing.deletedAt = DateTime.now().toJSDate();

    await this.shortenerRepository.update(existing);
  }
}
