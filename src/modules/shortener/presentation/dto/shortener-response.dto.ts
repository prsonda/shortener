import { ShortenerMessages } from '@/shared/constants/messages';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenerResponseDto {
  @ApiProperty({
    example: '4117dd81-8b47-4164-8234-d0c5dbb9bb04',
    description: ShortenerMessages.id,
  })
  id: string;

  @ApiProperty({
    example: '4117dd81-8b47-4164-8234-d0c5dbb9bb04',
    description: ShortenerMessages.userId,
  })
  userId: string | null;

  @ApiProperty({
    example: 'https://url.com',
    description: ShortenerMessages.originalUrl,
  })
  originalUrl: string;

  @ApiProperty({
    example: 'bvEERf',
    description: ShortenerMessages.shortCode,
  })
  shortCode: string;

  @ApiProperty({
    example: 100,
    description: ShortenerMessages.clicks,
  })
  clicks: number;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: ShortenerMessages.createdAt,
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: ShortenerMessages.updatedAt,
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: ShortenerMessages.deletedAt,
  })
  deletedAt: Date | null;
}
