import { Injectable } from '@nestjs/common';
import { ShortenerRepository } from '../../domain/shortener.repositoy';
import { ShortFilterDto } from '../../presentation/dto/short-filter.dto';
import { ShortenerResponseAllDto } from '../../presentation/dto/shortener-response-all.dto';

@Injectable()
export class ShortenerFindByUserUseCase {
  constructor(private readonly shortenerRepository: ShortenerRepository) {}

  async execute(
    userId: string,
    filter: ShortFilterDto,
  ): Promise<ShortenerResponseAllDto> {
    const shortUrls = await this.shortenerRepository.findByUser(userId, filter);

    return shortUrls;
  }
}
