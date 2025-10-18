import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@src/common/interceptors';
import { AppDataSource } from '@src/db/data-source';
import { TransactionSeeder, UserSeeder } from '@src/db/seeders';

const logger = new ConsoleLogger({
  context: 'Bootstrap',
  prefix: 'Gualet',
});

async function runSeeders() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userSeeder = new UserSeeder(AppDataSource);
    await userSeeder.run();

    // Get test user and seed transactions
    const userRepository = AppDataSource.getRepository('UserEntity' as any);
    const testUser = await userRepository.findOne({
      where: { email: 'test@gualet.app' },
    });

    if (testUser) {
      const transactionSeeder = new TransactionSeeder(AppDataSource);
      await transactionSeeder.run(testUser.id);
    }

    await AppDataSource.destroy();
  } catch (error) {
    logger.error('Error running seeders:', error);
  }
}

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
    // Run seeders in development
    logger.log('🌱 Running database seeders...');
    await runSeeders();

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
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch(logger.error);
