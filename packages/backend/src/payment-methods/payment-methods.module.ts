import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { PaymentMethodsRepositoryFactory } from './payment-methods.repository.factory';
import { PaymentMethodEntity, TransactionEntity } from '@src/db';
import { DemoModule } from '@src/demo';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethodEntity, TransactionEntity]),
    DemoModule,
  ],
  controllers: [PaymentMethodsController],
  providers: [
    PaymentMethodsService,
    PaymentMethodsRepository,
    PaymentMethodsRepositoryFactory,
  ],
  exports: [
    TypeOrmModule,
    PaymentMethodsRepository,
    PaymentMethodsService,
    PaymentMethodsRepositoryFactory,
  ],
})
export class PaymentMethodsModule {}
