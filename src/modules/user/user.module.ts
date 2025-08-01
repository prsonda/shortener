import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BcryptService } from '../auth/infrastructure/bcrypt.service';
import { UserCreateUseCase } from './application/use-cases/user-create.use-case';
import { UserFindByEmailUseCase } from './application/use-cases/user-find-by-email.use-case';
import { UserFindByIdUseCase } from './application/use-cases/user-find-by-id.use-case';
import { UserService } from './application/user.service';
import { UserRepository } from './domain/user.repository';
import { UserPrismaRepository } from './infrastructure/user-prisma-repository';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule],
  providers: [
    UserService,
    UserCreateUseCase,
    UserFindByEmailUseCase,
    UserFindByIdUseCase,
    BcryptService,
    { provide: UserRepository, useClass: UserPrismaRepository },
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
