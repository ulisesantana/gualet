import {Id} from "../id";
import {OperationType} from "../../operation-type";

export interface CategoryParams {
  id?: Id;
  name: string;
  type: OperationType;
  icon?: string;
  color?: string;
}

export class Category {
  readonly id: Id;
  readonly name: string;
  readonly type: OperationType;
  readonly icon: string;
  readonly color: string;

  constructor(input: CategoryParams) {
    this.id = input.id || new Id();
    this.name = input.name.trim();
    this.type = input.type;
    this.icon = input.icon?.trim() || "";
    this.color = input.color?.trim() || "#545454";
  }

  get title() {
    return this.icon ? `${this.icon} ${this.name}` : this.name;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.name,
      type: this.type,
      icon: this.icon,
      color: this.color,
    };
  }
}
