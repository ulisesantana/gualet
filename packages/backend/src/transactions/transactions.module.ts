import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsRepositoryFactory } from './transactions.repository.factory';
import { TransactionEntity } from '@src/db';
import { DemoModule } from '@src/demo';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), DemoModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    TransactionsRepositoryFactory,
  ],
  exports: [
    TypeOrmModule,
    TransactionsRepository,
    TransactionsRepositoryFactory,
  ],
})
export class TransactionsModule {}
