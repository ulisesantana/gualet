import { Id, PaymentMethod } from "@domain/models";
import { Nullable } from "@domain/types";

export interface PaymentMethodRepository {
  create(paymentMethod: PaymentMethod): Promise<Nullable<PaymentMethod>>;

  update(paymentMethod: PaymentMethod): Promise<Nullable<PaymentMethod>>;

  findById(id: Id): Promise<Nullable<PaymentMethod>>;

  findAll(): Promise<PaymentMethod[]>;
}
