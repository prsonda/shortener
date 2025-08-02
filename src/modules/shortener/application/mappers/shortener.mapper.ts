import { ShortenerEntity } from '../../domain/entities/shortener.entity';

export class ShortenerMapper {
  static toEntity(data: any): ShortenerEntity {
    return {
      id: data.id,
      userId: data.userId,
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      clicks: data.clicks,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    };
  }
}
