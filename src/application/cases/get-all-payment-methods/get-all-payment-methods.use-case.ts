import { PaymentMethod } from "@domain/models";
import { PaymentMethodRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class GetAllPaymentMethodsUseCase
  implements UseCase<never, Promise<PaymentMethod[]>>
{
  constructor(private readonly repository: PaymentMethodRepository) {}
  async exec(): Promise<PaymentMethod[]> {
    return this.repository.findAll();
  }
}
