import { Id } from "./id";
import { TransactionOperation } from "./transaction";

export interface CategoryParams {
  id?: Id;
  name: string;
  type: TransactionOperation;
  icon?: string;
}

export class Category {
  readonly id: Id;
  readonly name: string;
  readonly type: TransactionOperation;
  readonly icon: string;

  constructor(input: CategoryParams) {
    this.id = input.id || new Id();
    this.name = input.name;
    this.type = input.type;
    this.icon = input.icon || "";
  }
}
