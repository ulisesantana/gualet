import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@src/common/interceptors';

const logger = new ConsoleLogger({
  context: 'Bootstrap',
  prefix: 'Gualet',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Gualet',
    }),
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config: ConfigService = app.get(ConfigService);
  if (config.get('NODE_ENV') === 'test') {
    app.enableShutdownHooks();
  }
  if (config.get('NODE_ENV') === 'development') {
    const docsRoute = 'api/docs';
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Gualet API')
      .setDescription('The Gualet API for managing personal finances')
      .setVersion('1.0')
      .addTag('Authentication', 'User authentication endpoints')
      .addTag('Categories', 'Manage income and expense categories')
      .addTag('Payment Methods', 'Manage payment methods')
      .addTag('Transactions', 'Manage financial transactions')
      .addTag('User Preferences', 'Manage user preferences')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        'JWT',
      )
      .addCookieAuth('access_token', {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'JWT token stored in httpOnly cookie',
      })
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(docsRoute, app, documentFactory);
    logger.debug(`🔍 Check docs on ${docsRoute}`);
  }

  await app.listen(process.env.PORT ?? 5050);
  logger.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 5050}`,
  );
}

bootstrap().catch((error) => {
  logger.error('❌ Error during application bootstrap:', error);
  process.exit(1);
});
