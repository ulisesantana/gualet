import { PaymentMethod } from "@gualet/shared";
import { PaymentMethodRepository } from "../payment-method.repository";
import { UseCase } from "@common/application/use-case";

export class GetAllPaymentMethodsUseCase
  implements UseCase<never, Promise<PaymentMethod[]>>
{
  constructor(private readonly repository: PaymentMethodRepository) {}
  async exec(): Promise<PaymentMethod[]> {
    return this.repository.findAll();
  }
}
