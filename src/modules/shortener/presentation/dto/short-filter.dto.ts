import { ShortenerMessages } from '@/shared/constants/messages';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ShortFilterDto extends PaginationDto {
  @ApiProperty({
    description: ShortenerMessages.search,
    example: 'FmKsGk',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: ShortenerMessages.createdFrom,
    example: '2025-08-02',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiProperty({
    description: ShortenerMessages.createdTo,
    example: '2025-08-02',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiProperty({
    description: ShortenerMessages.minClicks,
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  minClicks?: number;

  @ApiProperty({
    description: ShortenerMessages.minClicks,
    example: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  maxClicks?: number;
}
