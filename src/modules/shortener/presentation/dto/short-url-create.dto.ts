import { ShortenerMessages } from '@/shared/constants/messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ShortUrlCreateDto {
  @ApiProperty({
    description: ShortenerMessages.originalUrl,
    example: 'https://www.example.com',
  })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
