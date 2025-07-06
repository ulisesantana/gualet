import { Day, Id, Transaction, TransactionConfig } from "@domain/models";
import { CommandResponse, Nullable } from "@domain/types";
import { OperationType, SortDirection } from "@gualet/core";

export interface FindTransactionsCriteria {
  from?: Day;
  to?: Day;
  categoryId?: Id;
  paymentMethodId?: Id;
  operation?: OperationType;
  sort?: SortDirection;
  page?: number;
  pageSize?: number;
}

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Nullable<Transaction>>;

  update(transaction: Transaction): Promise<Nullable<Transaction>>;

  findById(id: Id): Promise<Nullable<Transaction>>;

  find(criteria: FindTransactionsCriteria): Promise<Transaction[]>;

  fetchTransactionConfig(): Promise<TransactionConfig>;

  remove(id: Id): Promise<CommandResponse>;
}
