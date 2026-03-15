import { Id, PaymentMethod } from "@gualet/shared";
import { PaymentMethodRepository } from "../payment-method.repository";
import { UseCase } from "@common/application/use-case";
import { PaymentMethodNotFoundError } from "@common/domain/errors";

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
