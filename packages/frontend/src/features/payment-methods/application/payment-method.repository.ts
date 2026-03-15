import { Id, PaymentMethod } from "@gualet/shared";
import { Nullable } from "@common/domain/types";

export interface PaymentMethodRepository {
  create(paymentMethod: PaymentMethod): Promise<PaymentMethod>;

  update(paymentMethod: PaymentMethod): Promise<PaymentMethod>;

  findById(id: Id): Promise<Nullable<PaymentMethod>>;

  findAll(): Promise<PaymentMethod[]>;

  delete(id: Id): Promise<void>;
}
