import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenResponseDto } from '../../presentation/dto/auth-response.dto';
import { JwtPayloadDto } from '../../presentation/dto/jwt-payload.dto';

@Injectable()
export class AuthGenerateTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(payload: JwtPayloadDto): Promise<AuthTokenResponseDto> {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
