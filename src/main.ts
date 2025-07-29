import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './infra/http/filters/all-exceptions.filter';
import { SecureMiddleware } from './infra/http/middlewares/secure.middleware';
import { logger } from './infra/logger/logger.service';
import { DocsMessages } from './shared/constants/messages';

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

  const options = new DocumentBuilder()
    .setTitle(DocsMessages.main.title)
    .setDescription(DocsMessages.main.description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
