import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  if (config.get('NODE_ENV') === 'development') {
    const docsRoute = 'api/docs';
    const config = new DocumentBuilder()
      .setTitle('Gualet API')
      .setDescription('The Gualet API description')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(docsRoute, app, documentFactory);
    console.debug(`🔍 Check docs on ${docsRoute}`);
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch(console.error);
