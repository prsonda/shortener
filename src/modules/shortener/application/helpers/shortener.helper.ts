import { ErrorMessages } from '@/shared/constants/messages';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShortenerRepository } from '../../domain/shortener.repositoy';

@Injectable()
export class ShortenerHelper {
  constructor(private readonly shortenerRepository: ShortenerRepository) {}

  async getOwnedShortCodeOrFail(shortCode: string, userId?: string) {
    const item = await this.shortenerRepository.findByShortCode(shortCode);
    if (!item) throw new NotFoundException(ErrorMessages.notFound);
    if (userId && item.userId !== userId)
      throw new ForbiddenException(ErrorMessages.forbidden);
    return item;
  }
}
