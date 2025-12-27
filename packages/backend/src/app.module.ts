import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'node:path';
import { AuthController, AuthModule, AuthService } from '@src/auth';
import { UserModule, UserService } from '@src/users';
import {
  CategoriesController,
  CategoriesModule,
  CategoriesService,
} from '@src/categories';
import {
  PaymentMethodsController,
  PaymentMethodsModule,
  PaymentMethodsService,
} from '@src/payment-methods';
import {
  TransactionsController,
  TransactionsModule,
  TransactionsService,
} from '@src/transactions';
import {
  UserPreferencesController,
  UserPreferencesModule,
} from '@src/user-preferences';
import { HealthController } from './health/health.controller';
import {
  CategoryEntity,
  PaymentMethodEntity,
  TransactionEntity,
  UserEntity,
  UserPreferencesEntity,
} from '@src/db';
import { DatabaseSeederService } from '@src/db/database-seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
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
        entities: [
          UserEntity,
          CategoryEntity,
          PaymentMethodEntity,
          TransactionEntity,
          UserPreferencesEntity,
        ],
        synchronize: ['development', 'test'].includes(
          configService.get('NODE_ENV')!,
        ),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      CategoryEntity,
      PaymentMethodEntity,
      TransactionEntity,
    ]),
    ServeStaticModule.forRootAsync({
      useFactory: () => [
        {
          rootPath: resolve(__dirname, '../public'),
          exclude: ['/api/*'],
          serveRoot: '/',
        },
      ],
    }),
    AuthModule,
    UserModule,
    CategoriesModule,
    PaymentMethodsModule,
    TransactionsModule,
    UserPreferencesModule,
  ],
  controllers: [
    AuthController,
    CategoriesController,
    PaymentMethodsController,
    TransactionsController,
    UserPreferencesController,
    HealthController,
  ],
  providers: [
    UserService,
    AuthService,
    JwtService,
    CategoriesService,
    PaymentMethodsService,
    TransactionsService,
    DatabaseSeederService,
  ],
})
export class AppModule {}
