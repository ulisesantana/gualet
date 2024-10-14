import { Id, Transaction } from "@domain/models";
import { TransactionRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";
import { TransactionNotFoundError } from "@domain/errors";

export class GetTransactionUseCase
  implements UseCase<Id, Promise<Transaction>>
{
  constructor(private readonly repository: TransactionRepository) {}
  async exec(id: Id): Promise<Transaction> {
    const transaction = await this.repository.findById(id);
    if (!transaction) {
      throw new TransactionNotFoundError(id);
    }
    return transaction;
  }
}
