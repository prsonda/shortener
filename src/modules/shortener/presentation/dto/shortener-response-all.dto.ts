import { ShortenerMessages } from '@/shared/constants/messages';
import { PaginationResponseAllDto } from '@/shared/dto/pagination-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ShortenerResponseDto } from './shortener-response.dto';

export class ShortenerResponseAllDto extends PaginationResponseAllDto {
  @ApiProperty({
    type: ShortenerResponseDto,
    isArray: true,
    description: ShortenerMessages.listItens,
  })
  data: ShortenerResponseDto[];
}
