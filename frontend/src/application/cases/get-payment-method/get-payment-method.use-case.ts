import { Id, PaymentMethod } from "@domain/models";
import { PaymentMethodRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";
import { PaymentMethodNotFoundError } from "@domain/errors";

export class GetPaymentMethodUseCase
  implements UseCase<Id, Promise<PaymentMethod>>
{
  constructor(private readonly repository: PaymentMethodRepository) {}
  async exec(id: Id): Promise<PaymentMethod> {
    const method = await this.repository.findById(id);
    if (!method) {
      throw new PaymentMethodNotFoundError(id);
    }

    return method;
  }
}
