import {
  FindTransactionsCriteria,
  TransactionRepository,
} from "@application/repositories";
import { TransactionConfig } from "@domain/models";
import {
  Category,
  CategoryDto,
  Day,
  Id,
  Nullable,
  OperationType,
  PaymentMethod,
  PaymentMethodDto,
  TimeString,
  Transaction,
  TransactionDto,
} from "@gualet/shared";
import { HttpDataSource } from "@infrastructure/data-sources";
import { BaseResponse } from "@infrastructure/types";
import { CommandResponse } from "@domain/types";

import { HttpRepository } from "../http.repository";

interface CreateTransactionDto {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: TimeString;
  operation: OperationType;
  paymentMethodId: string;
}

type UpdateTransactionDto = Omit<CreateTransactionDto, "id">;

type FindTransactionsResponse = BaseResponse<
  { transactions: TransactionDto[] },
  Error
>;
type FindTransactionByIdResponse = BaseResponse<
  { transaction: TransactionDto },
  Error
>;
type SaveTransactionResponse = BaseResponse<
  { transaction: TransactionDto },
  Error
>;
type DeleteTransactionResponse = BaseResponse<null, Error>;

export class TransactionRepositoryImplementation
  extends HttpRepository
  implements TransactionRepository
{
  private readonly path = "/api/me/transactions";
  private readonly categoriesPath = "/api/me/categories";
  private readonly paymentMethodsPath = "/api/me/payment-methods";

  constructor(http: HttpDataSource) {
    super(http);
  }

  private static mapToTransaction(dto: TransactionDto) {
    return new Transaction({
      id: new Id(dto.id),
      amount: Number(dto.amount),
      category: TransactionRepositoryImplementation.mapCategory(dto.category),
      date: new Day(dto.date),
      description: dto.description || "",
      operation: dto.operation,
      paymentMethod: TransactionRepositoryImplementation.mapPaymentMethod(
        dto.paymentMethod,
      ),
    });
  }

  private static mapCategory(dto: CategoryDto): Category {
    return new Category({
      id: new Id(dto.id),
      icon: dto.icon ?? "",
      name: dto.name,
      type: dto.type,
      color: dto.color ?? "",
    });
  }

  private static mapPaymentMethod(dto: PaymentMethodDto): PaymentMethod {
    return new PaymentMethod({
      id: new Id(dto.id),
      icon: dto.icon ?? "",
      name: dto.name,
      color: dto.color ?? "",
    });
  }

  async create(transaction: Transaction): Promise<Nullable<Transaction>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.post<CreateTransactionDto, SaveTransactionResponse>(this.path, {
        id: transaction.id.toString(),
        description: transaction.description,
        amount: transaction.amount,
        categoryId: transaction.category.id.toString(),
        date: transaction.date.toISOString(),
        operation: transaction.operation,
        paymentMethodId: transaction.paymentMethod.id.toString(),
      }),
    );

    if (!success) {
      console.error(`Error: ${error}`);
      console.error(
        `Error creating transaction (${transaction.id}) :`,
        transaction.toString(),
      );
      return null;
    }

    return TransactionRepositoryImplementation.mapToTransaction(
      data.transaction,
    );
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

  async find(criteria: FindTransactionsCriteria) {
    if (!criteria.from) {
      criteria.from = new Day("1970-01-01");
    }
    if (!criteria.to) {
      criteria.to = new Day();
    }

    // Build query params
    const params = new URLSearchParams();
    if (criteria.from) {
      params.append("from", criteria.from.toString());
    }
    if (criteria.to) {
      params.append("to", criteria.to.toString());
    }
    // If pageSize is not specified, request all transactions (pageSize=0)
    if (criteria.pageSize === undefined) {
      params.append("pageSize", "0");
    } else {
      params.append("pageSize", criteria.pageSize.toString());
    }
    if (criteria.page !== undefined) {
      params.append("page", criteria.page.toString());
    }

    const url = `${this.path}?${params.toString()}`;
    const { success, error, data } = await this.handleQueryResponse(
      this.http.get<FindTransactionsResponse>(url),
    );

    if (!success) {
      console.error("Error fetching transactions:", error);
      return [];
    }

    return data.transactions.map(
      TransactionRepositoryImplementation.mapToTransaction,
    );
  }

  async findById(id: Id): Promise<Nullable<Transaction>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.get<FindTransactionByIdResponse>(`${this.path}/${id}`),
    );

    if (!success) {
      console.error(`Error fetching transaction ${id}.`);
      console.error(error);
      return null;
    }

    return TransactionRepositoryImplementation.mapToTransaction(
      data.transaction,
    );
  }

  async findLast(limit: number): Promise<Transaction[]> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.get<FindTransactionsResponse>(
        `${this.path}?limit=${limit}&sort=desc`,
      ),
    );

    if (!success) {
      console.error("Error fetching last transactions:", error);
      return [];
    }

    return data.transactions
      .map(TransactionRepositoryImplementation.mapToTransaction)
      .slice(0, limit);
  }

  remove(id: Id): Promise<CommandResponse> {
    return this.handleCommandResponse(
      this.http.delete<DeleteTransactionResponse>(`${this.path}/${id}`),
    );
  }

  async update(transaction: Transaction): Promise<Nullable<Transaction>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.patch<UpdateTransactionDto, SaveTransactionResponse>(
        this.path,
        {
          description: transaction.description,
          amount: transaction.amount,
          categoryId: transaction.category.id.toString(),
          date: transaction.date.toISOString(),
          operation: transaction.operation,
          paymentMethodId: transaction.paymentMethod.id.toString(),
        },
      ),
    );

    if (!success) {
      console.error(`Error: ${error}`);
      console.error(
        `Error saving transaction (${transaction.id}) :`,
        transaction.toString(),
      );
      return null;
    }

    return TransactionRepositoryImplementation.mapToTransaction(
      data.transaction,
    );
  }

  private async fetchCategories(): Promise<Category[]> {
    const { success, data, error } = await this.handleQueryResponse(
      this.http.get<
        BaseResponse<
          {
            categories: CategoryDto[];
          },
          Error
        >
      >(this.categoriesPath),
    );

    if (!success) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data.categories.map(TransactionRepositoryImplementation.mapCategory);
  }

  private async fetchPaymentMethods(): Promise<PaymentMethod[]> {
    const { success, data, error } = await this.handleQueryResponse(
      this.http.get<
        BaseResponse<
          {
            paymentMethods: PaymentMethodDto[];
          },
          Error
        >
      >(this.paymentMethodsPath),
    );

    if (!success) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data.paymentMethods.map(
      TransactionRepositoryImplementation.mapPaymentMethod,
    );
  }
}
