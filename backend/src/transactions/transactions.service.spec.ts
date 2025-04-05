import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from './entities';
import { Repository } from 'typeorm';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        TransactionsRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
