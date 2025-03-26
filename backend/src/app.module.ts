import { Module } from '@nestjs/common';
import { UserService } from './users/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities';
import { JwtService } from '@nestjs/jwt';
import { resolve } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoryEntity } from './categories/entities';

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
  ],
  controllers: [AuthController, CategoriesController],
  providers: [UserService, AuthService, JwtService, CategoriesService],
})
export class AppModule {}
