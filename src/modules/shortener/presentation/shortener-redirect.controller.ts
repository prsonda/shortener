import {
  DocsMessages,
  ErrorMessages,
  ShortenerMessages,
} from '@/shared/constants/messages';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ShortenerService } from '../application/shortener.service';
import { ShortUrlResponseDto } from './dto/short-url-response.dto';

@Controller()
@ApiTags(DocsMessages.url.tag)
export class ShortenerRedirectController {
  constructor(private shortenerService: ShortenerService) {}

  @Get(':shortCode')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: ShortenerMessages.redirect.summary,
    description: ShortenerMessages.redirect.summary,
  })
  @ApiResponse({
    status: 302,
    description: ShortenerMessages.redirect.success,
    type: ShortUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessages.notFound,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const shortUrl = await this.shortenerService.findByShortCode(shortCode);
    if (!shortUrl) {
      return res.status(404).send(ErrorMessages.notFound);
    }

    await this.shortenerService.incrementClicks(shortCode);

    return res.redirect(shortUrl.originalUrl);
  }
}
