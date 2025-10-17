import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { HttpDataSource } from "@infrastructure/data-sources";
import { Id, PaymentMethod, PaymentMethodDto } from "@gualet/shared";

import { PaymentMethodRepositoryImplementation } from "./payment-method.repository";

describe("PaymentMethodRepositoryImplementation (HTTP)", () => {
  let repository: PaymentMethodRepositoryImplementation;
  let mockHttp: Mocked<HttpDataSource>;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
    } as unknown as Mocked<HttpDataSource>;
    repository = new PaymentMethodRepositoryImplementation(
      mockHttp as unknown as HttpDataSource,
    );
    vi.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return a list of payment methods", async () => {
      const paymentMethods: PaymentMethodDto[] = [
        { id: "pm-1", name: "Credit Card", icon: "💳", color: "#fff" },
        { id: "pm-2", name: "Cash", icon: "💵", color: "#000" },
      ];
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { paymentMethods },
      });
      const result = await repository.findAll();
      expect(result[0]).toBeInstanceOf(PaymentMethod);
      expect(result[0].id.toString()).toBe("pm-1");
      expect(result[1].id.toString()).toBe("pm-2");
    });

    it("should return an empty array if there is an error", async () => {
      mockHttp.get.mockResolvedValue({ success: false, error: "fail" });
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("should return a payment method by id", async () => {
      const paymentMethod: PaymentMethodDto = {
        id: "pm-1",
        name: "Credit Card",
        icon: "💳",
        color: "#fff",
      };
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { paymentMethod },
      });
      const result = await repository.findById(new Id("pm-1"));
      expect(result).toBeInstanceOf(PaymentMethod);
      expect(result?.id.toString()).toBe("pm-1");
    });

    it("should return null if there is an error or not found", async () => {
      mockHttp.get.mockResolvedValue({ success: false, error: "fail" });
      const result = await repository.findById(new Id("pm-1"));
      expect(result).toBeNull();
    });
  });

  describe("save", () => {
    it("should save and return the payment method", async () => {
      const paymentMethod = new PaymentMethod({
        id: new Id("pm-1"),
        name: "Credit Card",
        icon: "💳",
        color: "#fff",
      });
      const paymentMethodDto: PaymentMethodDto = {
        id: "pm-1",
        name: "Credit Card",
        icon: "💳",
        color: "#fff",
      };
      mockHttp.post.mockResolvedValue({
        success: true,
        data: { paymentMethod: paymentMethodDto },
      });
      const result = await repository.create(paymentMethod);
      expect(result).toBeInstanceOf(PaymentMethod);
      expect(result?.id.toString()).toBe("pm-1");
    });

    it("should return null if there is an error when saving", async () => {
      const paymentMethod = new PaymentMethod({
        id: new Id("pm-1"),
        name: "Credit Card",
        icon: "💳",
        color: "#fff",
      });
      mockHttp.post.mockResolvedValue({ success: false, error: "fail" });
      const result = await repository.create(paymentMethod);
      expect(result).toBeNull();
    });
  });
});
