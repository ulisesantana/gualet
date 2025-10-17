import { PaymentMethodRepository } from "@application/repositories";
import { Nullable } from "@domain/types";
import { Id, PaymentMethod, PaymentMethodDto } from "@gualet/core";
import { BaseResponse } from "@infrastructure/types";
import { HttpDataSource } from "@infrastructure/data-sources";

import { HttpRepository } from "../http.repository";

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

  static mapToDto(paymentMethod: PaymentMethod): PaymentMethodDto {
    return {
      id: paymentMethod.id.toString(),
      name: paymentMethod.name,
      icon: paymentMethod.icon,
      color: paymentMethod.color,
    };
  }

  async create(paymentMethod: PaymentMethod): Promise<Nullable<PaymentMethod>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.post<PaymentMethodDto, SavePaymentMethodResponse>(
        this.path,
        PaymentMethodRepositoryImplementation.mapToDto(paymentMethod),
      ),
    );

    if (!success) {
      console.error("Error saving payment method:", error);
      return null;
    }

    return PaymentMethodRepositoryImplementation.mapToPaymentMethod(
      data.paymentMethod,
    );
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

  async update(paymentMethod: PaymentMethod): Promise<Nullable<PaymentMethod>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.patch<PaymentMethodDto, SavePaymentMethodResponse>(
        this.path,
        PaymentMethodRepositoryImplementation.mapToDto(paymentMethod),
      ),
    );

    if (!success) {
      console.error("Error saving payment method:", error);
      return null;
    }

    return PaymentMethodRepositoryImplementation.mapToPaymentMethod(
      data.paymentMethod,
    );
  }
}
