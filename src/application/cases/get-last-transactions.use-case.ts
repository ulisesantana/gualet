import { UseCase } from "./use-case";
import { Transaction } from "../../domain/models";
import { TransactionRepository } from "../repositories";

export class GetLastTransactions
  implements UseCase<number, Promise<Transaction[]>>
{
  constructor(private readonly repository: TransactionRepository) {}
  async exec(amountOfTransactions: number = 10): Promise<Transaction[]> {
    return this.repository.findLast(amountOfTransactions);
  }
}
