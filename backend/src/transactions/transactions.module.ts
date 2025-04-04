import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities';
import { TransactionsRepositoryImpl } from './transactions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepositoryImpl],
  exports: [TypeOrmModule],
})
export class TransactionsModule {}
