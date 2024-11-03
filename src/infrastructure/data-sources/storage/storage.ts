export enum StorageType {
  Local = "local",
  Session = "session",
}

export class StorageDataSource {
  private readonly storage: Storage;

  constructor(
    private namespace: string,
    readonly type: StorageType = StorageType.Local,
  ) {
    this.storage =
      type === StorageType.Session
        ? window.sessionStorage
        : window.localStorage;
  }

  get(itemName: string) {
    const item = this.storage.getItem(this.prefixNamespace(itemName));
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
      this.storage.setItem(
        this.prefixNamespace(itemName),
        JSON.stringify(item),
      );
    } else {
      this.storage.setItem(this.prefixNamespace(itemName), item);
    }
  }

  remove(itemName: string) {
    this.storage.removeItem(this.prefixNamespace(itemName));
  }

  private prefixNamespace(itemName: string): string {
    return `${this.namespace}:${itemName}`;
  }
}
