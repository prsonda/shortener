import { AuthService } from '@/modules/auth/application/auth.service';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/jwt.guard';
import { AuthTokenResponseDto } from '@/modules/auth/presentation/dto/auth-response.dto';
import { DocsMessages, ErrorMessages } from '@/shared/constants/messages';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { UserService } from '../application/user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
@ApiTags(DocsMessages.user.tag)
export class UserController {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: DocsMessages.user.summary,
    description: DocsMessages.user.summary,
  })
  @ApiResponse({
    status: 200,
    description: DocsMessages.user.success,
    type: AuthTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 409,
    description: ErrorMessages.conflict,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async create(@Body() body: UserCreateDto): Promise<AuthTokenResponseDto> {
    const user = await this.userService.create(body);
    const { access_token } = await this.authService.generateToken({
      sub: user.id,
      email: user.email,
    });

    return { user, access_token };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: DocsMessages.user.summary,
    description: DocsMessages.user.summary,
  })
  @ApiResponse({
    status: 200,
    description: DocsMessages.user.success,
    type: AuthTokenResponseDto,
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
    status: 404,
    description: ErrorMessages.notFound,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async findById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<UserResponseDto | null> {
    const { userId } = req.user as { userId: string };
    return await this.userService.findById(id, userId);
  }
}
