import { Day, Transaction } from "@domain/models";
import { CategoryReport } from "@domain/models/report/categoryReport";

interface ReportParams {
  from: Day;
  to: Day;
  transactions: Transaction[];
}

export class Report {
  readonly from: Day;
  readonly to: Day;
  readonly incomeReport: CategoryReport;
  readonly outcomeReport: CategoryReport;
  readonly total: number;

  constructor({ from, to, transactions }: ReportParams) {
    this.from = from;
    this.to = to;
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
