import { v4 } from 'uuid';

export class Id {
  readonly value: string;
  constructor(value: string | Id = v4()) {
    this.value = value.toString();
  }

  toString() {
    return this.value;
  }

  equals(other: Id | string): boolean {
    return this.value === other.toString();
  }
}
