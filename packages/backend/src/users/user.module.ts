import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserService } from './user.service';
import { DemoUserService } from './demo-user.service';
import { DemoDataResetService } from './demo-data-reset.service';
import { UserEntity } from '@src/db';
import { CategoriesModule } from '@src/categories';
import { PaymentMethodsModule } from '@src/payment-methods';
import { TransactionsModule } from '@src/transactions';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    CategoriesModule,
    PaymentMethodsModule,
    TransactionsModule,
  ],
  providers: [UserService, DemoUserService, DemoDataResetService],
  controllers: [],
  exports: [UserService, DemoUserService, TypeOrmModule],
})
export class UserModule {}
