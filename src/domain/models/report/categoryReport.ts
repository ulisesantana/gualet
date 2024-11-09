import { Category, Transaction } from "@domain/models";

type CategoryTotalTuple = [number, Category];

export class CategoryReport {
  readonly total: number;
  readonly totalByCategories: Array<CategoryTotalTuple>;

  constructor(transactions: Transaction[]) {
    const { total, totalByCategories } = CategoryReport.compute(transactions);
    this.total = total;
    this.totalByCategories = totalByCategories;
  }

  private static compute(transactions: Transaction[]): {
    total: number;
    totalByCategories: Array<CategoryTotalTuple>;
  } {
    const totalByCategories = Object.values(
      transactions.reduce<Record<string, CategoryTotalTuple>>((dict, t) => {
        const categoryId = t.category.id.toString();
        const total = dict[categoryId]?.[0] ?? 0;
        const amount = t.isIncome() ? t.amount : t.amount * -1;
        dict[categoryId] = [amount + total, t.category];
        return dict;
      }, {}),
    );

    return {
      total: totalByCategories.reduce(
        (total, [categoryTotal]) => total + categoryTotal,
        0,
      ),
      totalByCategories,
    };
  }
}
