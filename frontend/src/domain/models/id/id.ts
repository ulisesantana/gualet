import { v4 as uuid } from "uuid";

export class Id {
  private readonly value: string;

  constructor(value?: string | Id) {
    this.value = value?.toString() || uuid();
  }

  toString(): string {
    return this.value;
  }

  equals(other: Id | string): boolean {
    return this.value === other.toString();
  }
}
