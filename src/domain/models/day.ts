export class Day {
  private readonly date: Date;

  constructor(date: string) {
    this.date = new Date(date);
  }

  getDate(): number {
    return this.date.getUTCDate();
  }

  getFormatedDate(): string {
    return this.getDate().toString().padStart(2, "0");
  }

  getMonth(): number {
    return this.date.getUTCMonth() + 1;
  }

  getFormatedMonth(): string {
    return this.getMonth().toString().padStart(2, "0");
  }

  getYear(): number {
    return this.date.getUTCFullYear();
  }

  toString() {
    return `${this.getYear()}/${this.getFormatedMonth()}/${this.getFormatedDate()}`;
  }
}
