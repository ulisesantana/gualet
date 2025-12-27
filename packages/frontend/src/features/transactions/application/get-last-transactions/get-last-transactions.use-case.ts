import { TransactionRepository } from "../transaction.repository";
import { UseCase } from "@common/application/use-case";
import { Transaction } from "@gualet/shared";

export class GetLastTransactionsUseCase
  implements UseCase<number, Promise<Transaction[]>>
{
  constructor(private readonly repository: TransactionRepository) {}

  async exec(amountOfTransactions: number = 10): Promise<Transaction[]> {
    return this.repository.find({ page: 1, pageSize: amountOfTransactions });
  }
}
