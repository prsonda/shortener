import { JWT_EXPIRES_IN, JWT_SECRET } from '@/shared/config/env.provider';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './application/auth.service';
import { AuthGenerateTokenUseCase } from './application/use-cases/auth-generate-token.use-case';
import { AuthValidateUserUseCase } from './application/use-cases/auth-validate-user.use-case';
import { BcryptService } from './infrastructure/bcrypt.service';
import { JwtAuthGuard } from './infrastructure/jwt.guard';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AuthValidateUserUseCase,
    AuthGenerateTokenUseCase,
    BcryptService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
