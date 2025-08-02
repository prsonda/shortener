import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ShortenerHelper } from './application/helpers/shortener.helper';
import { ShortenerService } from './application/shortener.service';
import { ShortenerCreateUseCase } from './application/use-cases/shortener-create.use-case';
import { ShortenerDeleteUseCase } from './application/use-cases/shortener-delete.use-case';
import { ShortenerFindByCodeUseCase } from './application/use-cases/shortener-find-by-code.use-case';
import { ShortenerFindByUserUseCase } from './application/use-cases/shortener-find-by-user.use-case';
import { ShortenerUpdateClickUseCase } from './application/use-cases/shortener-update-click.use-case';
import { ShortenerUpdateUseCase } from './application/use-cases/shortener-update.use-case';
import { ShortenerRepository } from './domain/shortener.repositoy';
import { ShortenerPrismaRepository } from './infrastructure/shortener-prisma.repositoy';
import { ShortenerRedirectController } from './presentation/shortener-redirect.controller';
import { ShortenerController } from './presentation/shortener.controller';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [
    ShortenerService,
    { provide: ShortenerRepository, useClass: ShortenerPrismaRepository },
    ShortenerCreateUseCase,
    ShortenerFindByCodeUseCase,
    ShortenerUpdateUseCase,
    ShortenerUpdateClickUseCase,
    ShortenerFindByUserUseCase,
    ShortenerDeleteUseCase,
    ShortenerHelper,
  ],
  controllers: [ShortenerController, ShortenerRedirectController],
  exports: [ShortenerRepository],
})
export class ShortenerModule {}
