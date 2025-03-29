import { Id, OperationType } from '@src/common/domain';
import { Nullable } from '@src/common/types';

interface CategoryParams {
  id?: Id | string;
  name: string;
  type: OperationType;
  icon?: Nullable<string>;
  color?: Nullable<string>;
}

export class Category {
  id: Id;
  name: string;
  type: OperationType;
  icon: Nullable<string>;
  color: Nullable<string>;

  constructor(params: CategoryParams) {
    this.id = new Id(params.id);
    this.name = params.name;
    this.type = params.type;
    this.icon = params.icon || null;
    this.color = params.color || null;
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
