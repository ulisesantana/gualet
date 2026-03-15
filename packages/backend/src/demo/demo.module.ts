import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import {
  DemoCategoriesRepository,
  DemoPaymentMethodsRepository,
  DemoTransactionsRepository,
  DemoUserPreferencesRepository,
} from './repositories';

@Module({
  providers: [
    DemoService,
    DemoCategoriesRepository,
    DemoPaymentMethodsRepository,
    DemoTransactionsRepository,
    DemoUserPreferencesRepository,
  ],
  exports: [
    DemoService,
    DemoCategoriesRepository,
    DemoPaymentMethodsRepository,
    DemoTransactionsRepository,
    DemoUserPreferencesRepository,
  ],
})
export class DemoModule {}
