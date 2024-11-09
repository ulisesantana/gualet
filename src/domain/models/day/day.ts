export class Day {
  private readonly date: Date;

  constructor(date?: string) {
    if (!date) {
      [date] = new Date().toISOString().split("T");
    }
    const [year, month, day] = date.split(/\D+/).map((x) => Number(x));
    this.date = new Date();
    this.date.setUTCHours(12);
    this.date.setUTCDate(day);
    this.date.setUTCMonth(month - 1);
    this.date.setUTCFullYear(year);
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

  earlierThan(day: Day) {
    return this.toString() < day.toString();
  }

  toString(separator = "-") {
    return (
      this.getYear() +
      separator +
      this.getFormatedMonth() +
      separator +
      this.getFormatedDate()
    );
  }
}
