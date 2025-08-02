import { ShortenerMessages } from '@/shared/constants/messages';
import { ApiProperty } from '@nestjs/swagger';

export class ShortUrlResponseDto {
  @ApiProperty({
    description: ShortenerMessages.shortUrl,
    example: 'https://www.example.com/af5otc',
  })
  url: string;
}
