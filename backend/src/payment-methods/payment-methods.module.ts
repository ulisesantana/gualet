import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodEntity } from './entities';
import { PaymentMethodsRepository } from '@src/payment-methods/payment-methods.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, PaymentMethodsRepository],
  exports: [TypeOrmModule, PaymentMethodsRepository],
})
export class PaymentMethodsModule {}
