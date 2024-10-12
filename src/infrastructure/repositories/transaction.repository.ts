import { TransactionRepository } from "@application/repositories";
import {
  Category,
  Day,
  defaultIncomeCategories,
  defaultOutcomeCategories,
  defaultPaymentMethods,
  Id,
  PaymentMethod,
  Transaction,
  TransactionOperation,
  TransactionConfig,
} from "@domain/models";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "@infrastructure/data-sources/supabase";

type RawTransaction = Omit<
  Tables<"transactions">,
  "category_id" | "payment_method_id" | "created_at" | "user_id"
> & {
  categories: Pick<
    Tables<"categories">,
    "id" | "name" | "icon" | "type"
  > | null;
  payment_methods: Pick<
    Tables<"payment_methods">,
    "id" | "name" | "icon"
  > | null;
};

export class TransactionRepositoryImplementation
  implements TransactionRepository
{
  private readonly dbName = "transactions";

  constructor(
    private readonly userId: string,
    private readonly sb: SupabaseClient<Database>,
  ) {}

  async save(transaction: Transaction): Promise<void> {
    const { error } = await this.sb.from(this.dbName).upsert({
      id: transaction.id.toString(),
      user_id: this.userId,
      category_id: transaction.category.id.toString(),
      payment_method_id: transaction.paymentMethod.id.toString(),
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date.toString(),
      type: transaction.operation,
    });

    if (error) {
      console.error(`Error saving transaction: ${transaction}`);
      console.error(error);
    }
  }

  async remove(id: Id): Promise<void> {
    const { error } = await this.sb
      .from(this.dbName)
      .delete()
      .eq("user_id", this.userId)
      .eq("id", id.toString());

    if (error) {
      console.error(`Error removing transaction ${id}`);
      console.error(error);
    }
  }

  async findById(id: Id): Promise<Transaction> {
    const { data, error } = await this.sb
      .from(this.dbName)
      .select(
        `
        id,
        date,
        type,
        amount,
        description,
        categories (id, name, icon, type),
        payment_methods (id, name, icon)
      `,
      )
      .eq("user_id", this.userId)
      .eq("id", id.toString());

    if (error) {
      console.error(`Error fetching transaction ${id}.`);
      console.error(error);
      throw new Error(`Transaction ${id} not found.`);
    }

    return TransactionRepositoryImplementation.mapToTransaction(data[0]);
  }

  async findLast(limit: number): Promise<Transaction[]> {
    const { data, error } = await this.sb
      .from(this.dbName)
      .select(
        `
        id,
        date,
        type,
        amount,
        description,
        categories (id, name, icon, type),
        payment_methods (id, name, icon)
      `,
      )
      .eq("user_id", this.userId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error(`Error retrieving last ${limit} transactions.`);
      console.error(error);
      return [];
    }

    return data.map(TransactionRepositoryImplementation.mapToTransaction);
  }

  private static mapToTransaction(raw: RawTransaction) {
    return new Transaction({
      id: new Id(raw.id),
      amount: raw.amount,
      category: TransactionRepositoryImplementation.mapCategory(
        raw.categories as Tables<"categories">,
      ),
      date: new Day(raw.date),
      description: raw.description || "",
      operation: raw.type as TransactionOperation,
      paymentMethod: TransactionRepositoryImplementation.mapPaymentMethod(
        raw.payment_methods as Tables<"payment_methods">,
      ),
    });
  }

  async fetchTransactionConfig(): Promise<TransactionConfig> {
    const [paymentMethods, categories] = await Promise.all([
      this.fetchPaymentMethods(),
      this.fetchCategories(),
    ]);

    return categories.reduce<TransactionConfig>(
      (settings, category) => {
        if (Transaction.isOutcome(category.type)) {
          settings.outcomeCategories.push(category);
        } else {
          settings.incomeCategories.push(category);
        }
        return settings;
      },
      {
        paymentMethods,
        incomeCategories: [],
        outcomeCategories: [],
      },
    );
  }

  private async fetchCategories(): Promise<Category[]> {
    const response = await this.sb
      .from("categories")
      .select()
      .eq("user_id", this.userId)
      .order("name", { ascending: true });

    const defaultCategories = [
      ...defaultIncomeCategories,
      ...defaultOutcomeCategories,
    ];

    if (response.error) {
      return defaultCategories;
    }

    if (!response.data.length) {
      await this.sb.from("categories").insert(
        defaultCategories.map((category) => ({
          id: category.id.toString(),
          user_id: this.userId,
          name: category.name,
          icon: category.icon,
          type: category.type,
        })),
      );

      return defaultCategories;
    }

    return response.data.map(TransactionRepositoryImplementation.mapCategory);
  }

  private async fetchPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await this.sb
      .from("payment_methods")
      .select()
      .eq("user_id", this.userId)
      .order("name", { ascending: true });

    if (response.error) {
      return defaultPaymentMethods;
    }

    if (!response.data.length) {
      await this.sb.from("payment_methods").insert(
        defaultPaymentMethods.map((p) => ({
          id: p.id.toString(),
          user_id: this.userId,
          name: p.name,
          icon: p.icon,
        })),
      );

      return defaultPaymentMethods;
    }

    return response.data.map(
      TransactionRepositoryImplementation.mapPaymentMethod,
    );
  }

  private static mapCategory(rawCategory: Tables<"categories">): Category {
    return new Category({
      id: new Id(rawCategory.id),
      icon: rawCategory.icon ?? "",
      name: rawCategory.name,
      type: rawCategory.type as TransactionOperation,
    });
  }

  private static mapPaymentMethod(
    raw: Tables<"payment_methods">,
  ): PaymentMethod {
    return new PaymentMethod({
      id: new Id(raw.id),
      icon: raw.icon ?? "",
      name: raw.name,
    });
  }
}
