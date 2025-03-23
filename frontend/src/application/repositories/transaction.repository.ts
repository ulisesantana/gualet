import { Day, Id, Transaction, TransactionConfig } from "@domain/models";
import { Nullable } from "@domain/types";

export interface FindTransactionsCriteria {
  from?: Day;
  to?: Day;
}

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;

  findById(id: Id): Promise<Nullable<Transaction>>;

  findLast(limit: number): Promise<Transaction[]>;

  find(criteria: FindTransactionsCriteria): Promise<Transaction[]>;

  fetchTransactionConfig(): Promise<TransactionConfig>;

  remove(id: Id): Promise<void>;
}
