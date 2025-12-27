import { PaymentMethod } from "@gualet/shared";
import { PaymentMethodRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class SavePaymentMethodUseCase
  implements UseCase<PaymentMethod, Promise<void>>
{
  constructor(private readonly repository: PaymentMethodRepository) {}

  async exec(paymentMethod: PaymentMethod): Promise<void> {
    if (paymentMethod.isNew()) {
      await this.repository.create(paymentMethod);
    } else {
      await this.repository.update(paymentMethod);
    }
  }
}
