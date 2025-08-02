import { PartialType } from '@nestjs/swagger';
import { ShortUrlCreateDto } from './short-url-create.dto';

export class ShortUrlUpadateDto extends PartialType(ShortUrlCreateDto) {}
