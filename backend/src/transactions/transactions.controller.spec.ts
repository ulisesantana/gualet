import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from '@src/transactions/transactions.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from '@src/transactions/entities';
import { Repository } from 'typeorm';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        TransactionsRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
