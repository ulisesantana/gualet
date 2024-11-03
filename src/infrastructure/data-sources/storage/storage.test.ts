import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  StorageDataSource,
  StorageType,
} from "@infrastructure/data-sources/storage/storage";

describe("StorageDataSource", () => {
  let storageDataSource: StorageDataSource;
  const namespace = "testNamespace";

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should use localStorage by default", () => {
      storageDataSource = new StorageDataSource(namespace);
      expect(storageDataSource["storage"]).toBe(window.localStorage);
    });

    it("should use sessionStorage if type is set to Session", () => {
      storageDataSource = new StorageDataSource(namespace, StorageType.Session);
      expect(storageDataSource["storage"]).toBe(window.sessionStorage);
    });
  });

  describe("get", () => {
    beforeEach(() => {
      storageDataSource = new StorageDataSource(namespace);
    });

    it("should retrieve a JSON object from storage", () => {
      const key = "user";
      const item = { name: "Test", age: 30 };
      window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(item));

      const result = storageDataSource.get(key);
      expect(result).toEqual(item);
      expect(window.localStorage.getItem).toHaveBeenCalledWith(
        `${namespace}:${key}`,
      );
    });

    it("should retrieve a number from storage", () => {
      window.localStorage.getItem.mockReturnValueOnce("123");

      const result = storageDataSource.get("age");
      expect(result).toBe(123);
      expect(window.localStorage.getItem).toHaveBeenCalledWith(
        `${namespace}:age`,
      );
    });

    it("should retrieve a string from storage", () => {
      window.localStorage.getItem.mockReturnValueOnce("Hello");

      const result = storageDataSource.get("greeting");
      expect(result).toBe("Hello");
      expect(window.localStorage.getItem).toHaveBeenCalledWith(
        `${namespace}:greeting`,
      );
    });

    it("should return an empty string if the item is not found", () => {
      window.localStorage.getItem.mockReturnValueOnce(null);

      const result = storageDataSource.get("nonexistent");
      expect(result).toBe("");
      expect(window.localStorage.getItem).toHaveBeenCalledWith(
        `${namespace}:nonexistent`,
      );
    });
  });

  describe("set", () => {
    beforeEach(() => {
      storageDataSource = new StorageDataSource(namespace);
    });

    it("should store a JSON object in storage", () => {
      const item = { name: "Test", age: 30 };

      storageDataSource.set("user", item);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        `${namespace}:user`,
        JSON.stringify(item),
      );
    });

    it("should store a number in storage", () => {
      const item = 123;

      storageDataSource.set("age", item);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        `${namespace}:age`,
        item,
      );
    });

    it("should store a string in storage", () => {
      const item = "Hello";

      storageDataSource.set("greeting", item);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        `${namespace}:greeting`,
        item,
      );
    });
  });

  describe("remove", () => {
    beforeEach(() => {
      storageDataSource = new StorageDataSource(namespace);
    });

    it("should remove an item from storage", () => {
      storageDataSource.remove("user");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(
        `${namespace}:user`,
      );
    });
  });

  describe("prefixNamespace", () => {
    beforeEach(() => {
      storageDataSource = new StorageDataSource(namespace);
    });

    it("should prefix the item name with the namespace", () => {
      const itemName = "testItem";
      const prefixedName = storageDataSource["prefixNamespace"](itemName);
      expect(prefixedName).toBe(`${namespace}:${itemName}`);
    });
  });
});
