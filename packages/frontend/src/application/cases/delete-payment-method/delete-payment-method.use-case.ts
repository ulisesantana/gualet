import { Id } from "@gualet/shared";
import { PaymentMethodRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class DeletePaymentMethodUseCase implements UseCase<Id, Promise<void>> {
  constructor(private readonly repository: PaymentMethodRepository) {}

  async exec(id: Id): Promise<void> {
    await this.repository.delete(id);
  }
}
