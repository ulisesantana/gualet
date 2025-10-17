import { Id } from "@gualet/shared";
import { TransactionRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class RemoveTransactionUseCase implements UseCase<Id, Promise<void>> {
  constructor(private readonly repository: TransactionRepository) {}
  async exec(id: Id): Promise<void> {
    await this.repository.remove(id);
  }
}
