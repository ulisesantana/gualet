import { Id, PaymentMethod } from "@domain/models";

export interface PaymentMethodRepository {
  save(paymentMethod: PaymentMethod): Promise<void>;

  findById(id: Id): Promise<PaymentMethod>;

  findAll(): Promise<PaymentMethod[]>;
}
