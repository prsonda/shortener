import { UserResponseDto } from '@/modules/user/presentation/dto/user-response.dto';
import { AuthMessages } from '@/shared/constants/messages';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthTokenResponseDto } from '../presentation/dto/auth-response.dto';
import { JwtPayloadDto } from '../presentation/dto/jwt-payload.dto';
import { LoginDto } from '../presentation/dto/login.dto';
import { AuthGenerateTokenUseCase } from './use-cases/auth-generate-token.use-case';
import { AuthValidateUserUseCase } from './use-cases/auth-validate-user.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly authGenerateTokenUseCase: AuthGenerateTokenUseCase,
    private readonly authValidateUserUseCase: AuthValidateUserUseCase,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthTokenResponseDto> {
    const user = await this.validateUser(loginDto);
    if (!user) throw new UnauthorizedException(AuthMessages.invalidCredentials);
    const { access_token } = await this.generateToken({
      sub: user.id,
      email: user.email,
    });
    const userDto = plainToInstance(UserResponseDto, user);
    return { user: userDto, access_token };
  }

  async validateUser(loginDto: LoginDto): Promise<UserResponseDto | null> {
    const { email, password } = loginDto;
    return await this.authValidateUserUseCase.execute(email, password);
  }

  async generateToken(payload: JwtPayloadDto): Promise<AuthTokenResponseDto> {
    const token = await this.authGenerateTokenUseCase.execute(payload);
    return token;
  }
}
