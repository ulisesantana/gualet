import { Id, PaymentMethod } from "@domain/models";
import { Nullable } from "@domain/types";

export interface PaymentMethodRepository {
  save(paymentMethod: PaymentMethod): Promise<void>;

  findById(id: Id): Promise<Nullable<PaymentMethod>>;

  findAll(): Promise<PaymentMethod[]>;
}
