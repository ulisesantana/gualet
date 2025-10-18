import { PaymentMethod } from "@gualet/shared";
import { PaymentMethodRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class SavePaymentMethodUseCase
  implements UseCase<PaymentMethod, Promise<void>>
{
  constructor(private readonly repository: PaymentMethodRepository) {}

  async exec(paymentMethod: PaymentMethod): Promise<void> {
    await this.repository.update(paymentMethod);
  }
}
