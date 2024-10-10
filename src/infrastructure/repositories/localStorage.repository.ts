export class LocalStorageRepository {
  constructor(private namespace: string) {}

  get(itemName: string) {
    const item = localStorage.getItem(this.prefixNamespace(itemName));
    const numberPattern = new RegExp(/^\d+$/);
    const jsonPattern = new RegExp(/[[{](.|\n)*[}\]]/);

    if (item) {
      if (jsonPattern.test(item)) {
        return JSON.parse(item);
      } else if (numberPattern.test(item)) {
        return parseFloat(item);
      } else {
        return item;
      }
    } else {
      return "";
    }
  }

  set(itemName: string, item: any) {
    if (typeof item === "object") {
      localStorage.setItem(
        this.prefixNamespace(itemName),
        JSON.stringify(item),
      );
    } else {
      localStorage.setItem(this.prefixNamespace(itemName), item);
    }
  }

  remove(itemName: string) {
    localStorage.removeItem(this.prefixNamespace(itemName));
  }

  private prefixNamespace(itemName: string): string {
    return `${this.namespace}:${itemName}`;
  }
}
