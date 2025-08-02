import { ApiProperty } from '@nestjs/swagger';
import { PaginationMessages } from '../constants/messages/pagination.messages';
import { PaginationDto } from './pagination.dto';

export class PaginationResponseAllDto extends PaginationDto {
  @ApiProperty({
    description: PaginationMessages.totalItens,
    example: 50,
  })
  totalItens: number;

  @ApiProperty({
    description: PaginationMessages.totalPages,
    example: 5,
  })
  totalPages: number;
}
