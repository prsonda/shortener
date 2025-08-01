import {
  AuthMessages,
  DocsMessages,
  ErrorMessages,
} from '@/shared/constants/messages';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { AuthTokenResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags(DocsMessages.auth.tag)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: DocsMessages.auth.summary,
    description: DocsMessages.auth.summary,
  })
  @ApiResponse({
    status: 200,
    description: DocsMessages.auth.success,
    type: AuthTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.badRequest,
  })
  @ApiResponse({
    status: 401,
    description: AuthMessages.invalidCredentials,
  })
  @ApiResponse({
    status: 500,
    description: ErrorMessages.internal,
  })
  async login(@Body() body: LoginDto): Promise<AuthTokenResponseDto> {
    return this.authService.login(body);
  }
}
