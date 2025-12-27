import { Id } from "@gualet/shared";
import { TransactionRepository } from "../transaction.repository";
import { UseCase } from "@common/application/use-case";

export class RemoveTransactionUseCase implements UseCase<Id, Promise<void>> {
  constructor(private readonly repository: TransactionRepository) {}
  async exec(id: Id): Promise<void> {
    await this.repository.remove(id);
  }
}
