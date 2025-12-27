import { Id, Transaction } from "@gualet/shared";
import { TransactionRepository } from "../transaction.repository";
import { UseCase } from "@common/application/use-case";
import { TransactionNotFoundError } from "@common/domain/errors";

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
