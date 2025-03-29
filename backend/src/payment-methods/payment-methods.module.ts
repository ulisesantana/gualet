import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '@src/categories';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports: [TypeOrmModule],
})
export class PaymentMethodsModule {}
