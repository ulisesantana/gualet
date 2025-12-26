import {Id} from "../id";
import {OperationType} from "../../operation-type";

export interface CategoryParams {
  id?: Id;
  name: string;
  type: OperationType;
  icon?: string;
  color?: string;
}

// Type for new categories without ID (for creation)
export type NewCategoryParams = Omit<CategoryParams, 'id'>;

export class Category {
  readonly id: Id;
  readonly name: string;
  readonly type: OperationType;
  readonly icon: string;
  readonly color: string;
  readonly title: string;

  constructor(input: CategoryParams) {
    this.id = input.id || new Id();
    this.name = input.name.trim();
    this.type = input.type;
    this.icon = input.icon?.trim() || "";
    this.color = input.color?.trim() || "#545454";
    this.title = this.icon ? `${this.icon} ${this.name}` : this.name;
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

// Class for new categories (without ID from database)
export class NewCategory {
  readonly id: Id;
  readonly name: string;
  readonly type: OperationType;
  readonly icon: string;
  readonly color: string;
  readonly title: string;

  constructor(input: NewCategoryParams) {
    this.id = new Id(); // Generate ID on client
    this.name = input.name.trim();
    this.type = input.type;
    this.icon = input.icon?.trim() || "";
    this.color = input.color?.trim() || "#545454";
    this.title = this.icon ? `${this.icon} ${this.name}` : this.name;
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

  // Helper method to convert to Category after creation
  toCategory(): Category {
    return new Category({
      id: this.id,
      name: this.name,
      type: this.type,
      icon: this.icon,
      color: this.color,
    });
  }
}


