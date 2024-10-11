import { Id, Transaction } from "@domain/models";
import { TransactionRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class GetTransaction implements UseCase<Id, Promise<Transaction>> {
  constructor(private readonly repository: TransactionRepository) {}
  async exec(id: Id): Promise<Transaction> {
    return this.repository.findById(id);
  }
}
