import { Category, Day, Transaction } from "@domain/models";

type CategoryTotalTuple = [number, Category];

class CategoryReport {
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
      transactions.reduce<Record<string, CategoryTotalTuple>>(
        (dict, transaction) => {
          const categoryId = transaction.category.id.toString();
          const total = dict[categoryId]?.[0] ?? 0;
          dict[categoryId] = [transaction.amount + total, transaction.category];
          return dict;
        },
        {},
      ),
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

export class Report {
  readonly incomeReport: CategoryReport;
  readonly outcomeReport: CategoryReport;
  readonly total: number;

  constructor(
    readonly from: Day,
    readonly to: Day,
    transactions: Transaction[],
  ) {
    const { income, outcome } = Report.groupByOperation(transactions);
    this.incomeReport = new CategoryReport(income);
    this.outcomeReport = new CategoryReport(outcome);
    this.total = this.incomeReport.total + this.outcomeReport.total;
  }

  private static groupByOperation(transactions: Transaction[]) {
    return transactions.reduce<Record<"income" | "outcome", Transaction[]>>(
      (dict, transaction) => {
        if (transaction.isIncome()) {
          return {
            ...dict,
            income: dict.income.concat(transaction),
          };
        }
        return {
          ...dict,
          outcome: dict.outcome.concat(transaction),
        };
      },
      { income: [], outcome: [] },
    );
  }
}
