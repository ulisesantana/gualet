import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from '@src/db';
import { CategoriesModule } from '@src/categories';
import { PaymentMethodsModule } from '@src/payment-methods';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CategoriesModule,
    PaymentMethodsModule,
  ],
  providers: [UserService],
  controllers: [],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
