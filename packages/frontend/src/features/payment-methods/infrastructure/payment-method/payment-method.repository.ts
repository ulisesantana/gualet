import { Nullable } from "@common/domain/types";
import {
  Id,
  PaymentMethod,
  PaymentMethodDto,
  UpdatePaymentMethodDto,
} from "@gualet/shared";
import { BaseResponse } from "@infrastructure/types";
import { HttpDataSource, HttpRepository } from "@common/infrastructure";

import { PaymentMethodRepository } from "../../application/payment-method.repository";

type SavePaymentMethodResponse = BaseResponse<
  { paymentMethod: PaymentMethodDto },
  Error
>;

export class PaymentMethodRepositoryImplementation
  extends HttpRepository
  implements PaymentMethodRepository
{
  private readonly path = "/api/me/payment-methods";

  constructor(http: HttpDataSource) {
    super(http);
  }

  static mapToPaymentMethod(dto: PaymentMethodDto): PaymentMethod {
    return new PaymentMethod({
      id: new Id(dto.id),
      name: dto.name,
      icon: dto.icon ?? "",
      color: dto.color ?? "",
    });
  }

  static mapToPaymentMethodDto(paymentMethod: PaymentMethod): PaymentMethodDto {
    return {
      id: paymentMethod.id.toString(),
      name: paymentMethod.name,
      icon: paymentMethod.icon,
      color: paymentMethod.color,
    };
  }

  static mapToUpdatePaymentMethodDto(
    paymentMethod: PaymentMethod,
  ): UpdatePaymentMethodDto {
    return {
      name: paymentMethod.name,
      icon: paymentMethod.icon,
      color: paymentMethod.color,
    };
  }

  async create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.post<PaymentMethodDto, SavePaymentMethodResponse>(
        this.path,
        PaymentMethodRepositoryImplementation.mapToPaymentMethodDto(
          paymentMethod,
        ),
      ),
    );

    if (!success) {
      console.error("Error saving payment method:", error);
      throw new Error(error || "Failed to save payment method");
    }

    return PaymentMethodRepositoryImplementation.mapToPaymentMethod(
      data.paymentMethod,
    );
  }

  async delete(id: Id): Promise<void> {
    const { success, error } = await this.handleCommandResponse(
      this.http.delete<any>(`${this.path}/${id}`),
    );

    if (!success) {
      console.error(`Error deleting payment method ${id}:`, error);
      throw new Error(error || "Failed to delete payment method");
    }
  }

  async findAll(): Promise<PaymentMethod[]> {
    const { success, data, error } = await this.handleQueryResponse(
      this.http.get<
        BaseResponse<{ paymentMethods: PaymentMethodDto[] }, Error>
      >(this.path),
    );

    if (!success) {
      console.error(`Error fetching all payment methods.`);
      console.error(error);
      return [];
    }

    return data.paymentMethods.map(
      PaymentMethodRepositoryImplementation.mapToPaymentMethod,
    );
  }

  async findById(id: Id): Promise<Nullable<PaymentMethod>> {
    const { success, data, error } = await this.handleQueryResponse(
      this.http.get(`${this.path}/${id}`),
    );

    if (!success) {
      console.error(`Error fetching payment method ${id}.`);
      console.error(error);
      return null;
    }

    return PaymentMethodRepositoryImplementation.mapToPaymentMethod(
      data.paymentMethod,
    );
  }

  async update(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.patch<UpdatePaymentMethodDto, SavePaymentMethodResponse>(
        this.path.concat(`/${paymentMethod.id}`),
        PaymentMethodRepositoryImplementation.mapToUpdatePaymentMethodDto(
          paymentMethod,
        ),
      ),
    );

    if (!success) {
      console.error("Error saving payment method:", error);
      throw new Error(error || "Failed to save payment method");
    }

    return PaymentMethodRepositoryImplementation.mapToPaymentMethod(
      data.paymentMethod,
    );
  }
}
