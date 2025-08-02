import { ShortFilterDto } from '../presentation/dto/short-filter.dto';
import { ShortenerResponseAllDto } from '../presentation/dto/shortener-response-all.dto';
import { ShortenerResponseDto } from '../presentation/dto/shortener-response.dto';
import { ShortenerEntity } from './entities/shortener.entity';

export abstract class ShortenerRepository {
  abstract create(shortenerEntity: ShortenerEntity): Promise<void>;

  abstract findByShortCode(
    shortCode: string,
  ): Promise<ShortenerResponseDto | null>;

  abstract findByUser(
    userId: string,
    filter: ShortFilterDto,
  ): Promise<ShortenerResponseAllDto>;

  abstract update(shortenerEntity: ShortenerEntity): Promise<void>;
}
