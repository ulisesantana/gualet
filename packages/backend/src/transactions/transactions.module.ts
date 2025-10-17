import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsRepository } from './transactions.repository';
import { TransactionEntity } from '@src/db';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TypeOrmModule, TransactionsRepository],
})
export class TransactionsModule {}
