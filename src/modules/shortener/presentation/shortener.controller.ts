import { JwtAuthGuard } from '@/modules/auth/infrastructure/jwt.guard';
import { OptionalJwtAuthGuard } from '@/modules/auth/infrastructure/optional-jwt-auth.guard';
import {
  DocsMessages,
  ErrorMessages,
  ShortenerMessages,
} from '@/shared/constants/messages';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ShortenerService } from '../application/shortener.service';
import { ShortFilterDto } from './dto/short-filter.dto';
import { ShortUrlCreateDto } from './dto/short-url-create.dto';
import { ShortUrlResponseDto } from './dto/short-url-response.dto';
import { ShortUrlUpadateDto } from './dto/short-url-update.dto';
import { ShortenerResponseAllDto } from './dto/shortener-response-all.dto';
import { ShortenerResponseDto } from './dto/shortener-response.dto';

@Controller('shortener')
@ApiTags(DocsMessages.url.tag)
export class ShortenerController {
  constructor(private shortenerService: ShortenerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: ShortenerMessages.create.summary,
    description: ShortenerMessages.create.summary,
  })
  @ApiResponse({
    status: 201,
    description: ShortenerMessages.create.success,
    type: ShortUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async create(
    @Req() req: Request,
    @Body() body: ShortUrlCreateDto,
  ): Promise<ShortUrlResponseDto> {
    const userId = (req.user as { userId?: string })?.userId;
    return this.shortenerService.create(body, userId);
  }

  @Get(':shortCode')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: ShortenerMessages.get.summary,
    description: ShortenerMessages.get.summary,
  })
  @ApiResponse({
    status: 200,
    description: ShortenerMessages.get.success,
    type: ShortenerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessages.unauthorized,
  })
  @ApiResponse({
    status: 403,
    description: ErrorMessages.forbidden,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessages.notFound,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async findByCode(
    @Req() req: Request,
    @Param('shortCode') shortCode: string,
  ): Promise<ShortenerResponseDto> {
    const userId = (req.user as { userId: string }).userId;
    return await this.shortenerService.findByShortCode(shortCode, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: ShortenerMessages.getAll.summary,
    description: ShortenerMessages.getAll.summary,
  })
  @ApiResponse({
    status: 200,
    description: ShortenerMessages.getAll.success,
    type: ShortenerResponseAllDto,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessages.unauthorized,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async findByUser(
    @Req() req: Request,
    @Query() query: ShortFilterDto,
  ): Promise<ShortenerResponseAllDto> {
    const userId = (req.user as { userId: string }).userId;
    return await this.shortenerService.findByUser(userId, query);
  }

  @Patch(':shortCode')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: ShortenerMessages.update.summary,
    description: ShortenerMessages.update.summary,
  })
  @ApiResponse({
    status: 200,
    description: ShortenerMessages.update.success,
    type: ShortUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessages.unauthorized,
  })
  @ApiResponse({
    status: 403,
    description: ErrorMessages.forbidden,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessages.notFound,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async update(
    @Param('shortCode') shortCode: string,
    @Body() body: ShortUrlUpadateDto,
    @Req() req: Request,
  ): Promise<ShortUrlResponseDto> {
    const userId = (req.user as { userId: string }).userId;
    return this.shortenerService.update(userId, shortCode, body);
  }

  @Patch(':shortCode/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: ShortenerMessages.delete.summary,
    description: ShortenerMessages.delete.summary,
  })
  @ApiResponse({
    status: 204,
    description: ShortenerMessages.delete.success,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 401,
    description: ErrorMessages.unauthorized,
  })
  @ApiResponse({
    status: 403,
    description: ErrorMessages.forbidden,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessages.notFound,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  remove(@Req() req: Request, @Param('shortCode') shortCode: string) {
    const userId = (req.user as { userId: string }).userId;
    return this.shortenerService.remove(userId, shortCode);
  }
}
