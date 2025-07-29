import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './infra/http/filters/all-exceptions.filter';
import { SecureMiddleware } from './infra/http/middlewares/secure.middleware';
import { logger } from './infra/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.disable('x-powered-by');
  const secureMiddleware = new SecureMiddleware();
  app.use(secureMiddleware.use.bind(secureMiddleware));

  const baseUrl = process.env.BASE_URL;

  app.enableCors({
    origin: baseUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
