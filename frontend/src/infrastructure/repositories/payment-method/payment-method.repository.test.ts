import { beforeEach, describe, expect, it, vi } from "vitest";
import { Id, PaymentMethod } from "@domain/models";
import { HttpDataSource } from "@infrastructure/data-sources";
import { PaymentMethodDto } from "@gualet/core";

import { PaymentMethodRepositoryImplementation } from "./payment-method.repository";

type MockHttp = {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

describe("PaymentMethodRepositoryImplementation (HTTP)", () => {
  let repository: PaymentMethodRepositoryImplementation;
  let mockHttp: MockHttp;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
    };
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
      const result = await repository.save(paymentMethod);
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
      const result = await repository.save(paymentMethod);
      expect(result).toBeNull();
    });
  });
});
