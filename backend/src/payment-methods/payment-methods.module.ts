import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { PaymentMethodEntity } from '@src/db';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, PaymentMethodsRepository],
  exports: [TypeOrmModule, PaymentMethodsRepository, PaymentMethodsService],
})
export class PaymentMethodsModule {}
