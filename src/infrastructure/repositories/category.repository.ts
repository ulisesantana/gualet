import { CategoryRepository } from "@application/repositories";
import {
  Category,
  Day,
  defaultIncomeCategories,
  defaultOutcomeCategories,
  defaultPaymentMethods,
  Id,
  PaymentMethod,
  TransactionOperation,
} from "@domain/models";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "@infrastructure/data-sources/supabase";

type RawCategory = Tables<"categories">;

export class CategoryRepositoryImplementation implements CategoryRepository {
  private readonly dbName = "categories";

  constructor(
    private readonly userId: string,
    private readonly sb: SupabaseClient<Database>,
  ) {}

  async save(category: Category): Promise<void> {
    const { error } = await this.sb.from(this.dbName).upsert({
      id: category.id.toString(),
      user_id: this.userId,
      name: category.name,
      icon: category.icon,
      type: category.type,
    });

    if (error) {
      console.error(`Error saving category: ${category}`);
      console.error(error);
    }
  }

  async findById(id: Id): Promise<Category> {
    const { data, error } = await this.sb
      .from(this.dbName)
      .select()
      .eq("user_id", this.userId)
      .eq("id", id.toString());

    if (error) {
      console.error(`Error fetching category ${id}.`);
      console.error(error);
      throw new Error(`Category ${id} not found.`);
    }

    return CategoryRepositoryImplementation.mapToCategory(data[0]);
  }

  async findAll(): Promise<Category[]> {
    const { data, error } = await this.sb
      .from(this.dbName)
      .select()
      .eq("user_id", this.userId)
      .order("name", { ascending: true });

    if (error) {
      console.error(`Error fetching all categories.`);
      console.error(error);
      throw new Error(`Categories not found.`);
    }

    return data.map(CategoryRepositoryImplementation.mapToCategory);
  }

  static mapToCategory(raw: RawCategory) {
    return new Category({
      id: new Id(raw.id),
      name: raw.name,
      icon: raw.icon ?? "",
      type: raw.type as TransactionOperation,
    });
  }
}
