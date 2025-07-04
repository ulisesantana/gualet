import {Nullable, OperationType} from "./types";

export interface CategoryDto {
  id: string;
  name: string;
  type: OperationType;
  icon: Nullable<string>;
  color: Nullable<string>;
}
