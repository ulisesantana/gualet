import { Transaction } from "@domain/models";
import { TransactionRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class GetLastTransactions
  implements UseCase<number, Promise<Transaction[]>>
{
  constructor(private readonly repository: TransactionRepository) {}
  async exec(amountOfTransactions: number = 10): Promise<Transaction[]> {
    return this.repository.findLast(amountOfTransactions);
  }
}
