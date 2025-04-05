import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@src/common/interceptors';

const logger = new ConsoleLogger('Start');

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
  if (config.get('NODE_ENV') === 'development') {
    const docsRoute = 'api/docs';
    const config = new DocumentBuilder()
      .setTitle('Gualet API')
      .setDescription('The Gualet API description')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(docsRoute, app, documentFactory);
    logger.debug(`🔍 Check docs on ${docsRoute}`);
  }

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch(logger.error);
