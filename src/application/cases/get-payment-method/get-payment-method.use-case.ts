import { Id, PaymentMethod } from "@domain/models";
import { PaymentMethodRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class GetPaymentMethodUseCase
  implements UseCase<Id, Promise<PaymentMethod>>
{
  constructor(private readonly repository: PaymentMethodRepository) {}
  async exec(id: Id): Promise<PaymentMethod> {
    return this.repository.findById(id);
  }
}
