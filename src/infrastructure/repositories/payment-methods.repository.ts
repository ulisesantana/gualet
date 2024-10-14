import { PaymentMethodRepository } from "@application/repositories";
import { PaymentMethod, Id, TransactionOperation } from "@domain/models";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "@infrastructure/data-sources/supabase";

type RawPaymentMethod = Tables<"payment_methods">;

export class PaymentMethodRepositoryImplementation
  implements PaymentMethodRepository
{
  private readonly dbName = "payment_methods";

  constructor(
    private readonly userId: string,
    private readonly sb: SupabaseClient<Database>,
  ) {}

  async save(paymentMethod: PaymentMethod): Promise<void> {
    const { error } = await this.sb.from(this.dbName).upsert({
      id: paymentMethod.id.toString(),
      user_id: this.userId,
      name: paymentMethod.name,
      icon: paymentMethod.icon,
    });

    if (error) {
      console.error(`Error saving payment method: ${paymentMethod}`);
      console.error(error);
    }
  }

  async findById(id: Id): Promise<PaymentMethod> {
    const { data, error } = await this.sb
      .from(this.dbName)
      .select()
      .eq("user_id", this.userId)
      .eq("id", id.toString());

    if (error) {
      console.error(`Error fetching payment method ${id}.`);
      console.error(error);
      throw new Error(`Payment method ${id} not found.`);
    }

    return PaymentMethodRepositoryImplementation.mapToPaymentMethod(data[0]);
  }

  async findAll(): Promise<PaymentMethod[]> {
    const { data, error } = await this.sb
      .from(this.dbName)
      .select()
      .eq("user_id", this.userId)
      .order("name", { ascending: true });

    if (error) {
      console.error(`Error fetching all payment methods.`);
      console.error(error);
      throw new Error(`Payment methods not found.`);
    }

    return data.map(PaymentMethodRepositoryImplementation.mapToPaymentMethod);
  }

  static mapToPaymentMethod(raw: RawPaymentMethod) {
    return new PaymentMethod({
      id: new Id(raw.id),
      name: raw.name,
      icon: raw.icon ?? "",
    });
  }
}