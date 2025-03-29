import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { resolve } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AuthController, AuthModule, AuthService } from '@src/auth';
import { UserEntity, UserModule, UserService } from '@src/users';
import {
  CategoriesController,
  CategoriesModule,
  CategoriesService,
  CategoryEntity,
} from '@src/categories';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../../../.env'),
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT') || 5432,
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [UserEntity, CategoryEntity],
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => [
        {
          rootPath: resolve(__dirname, '../public'),
          exclude: ['/api*'],
          serveRoot: '/',
        },
      ],
    }),
    AuthModule,
    UserModule,
    CategoriesModule,
    PaymentMethodsModule,
  ],
  controllers: [AuthController, CategoriesController],
  providers: [UserService, AuthService, JwtService, CategoriesService],
})
export class AppModule {}
