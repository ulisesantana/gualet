import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { HttpDataSource } from "@common/infrastructure";
import { Id, PaymentMethod, PaymentMethodDto } from "@gualet/shared";

import { PaymentMethodRepositoryImplementation } from ".";

describe("PaymentMethodRepositoryImplementation (HTTP)", () => {
  let repository: PaymentMethodRepositoryImplementation;
  let mockHttp: Mocked<HttpDataSource>;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
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
      expect(result.id.toString()).toBe("pm-1");
    });

    it("should throw an error if saving fails", async () => {
      const paymentMethod = new PaymentMethod({
        id: new Id("pm-1"),
        name: "Credit Card",
        icon: "💳",
        color: "#fff",
      });
      mockHttp.post.mockResolvedValue({
        success: false,
        error: "Payment method name already exists",
      });
      await expect(repository.create(paymentMethod)).rejects.toThrow(
        "Failed to fetch data",
      );
    });
  });

  describe("update", () => {
    it("should update and return the payment method", async () => {
      const paymentMethod = new PaymentMethod({
        id: new Id("pm-1"),
        name: "Updated Card",
        icon: "🏦",
        color: "#000",
      });
      const paymentMethodDto: PaymentMethodDto = {
        id: "pm-1",
        name: "Updated Card",
        icon: "🏦",
        color: "#000",
      };
      mockHttp.patch.mockResolvedValue({
        success: true,
        data: { paymentMethod: paymentMethodDto },
      });
      const result = await repository.update(paymentMethod);
      expect(result).toBeInstanceOf(PaymentMethod);
      expect(result.id.toString()).toBe("pm-1");
      expect(result.name).toBe("Updated Card");
      expect(result.icon).toBe("🏦");
    });

    it("should throw an error if update fails", async () => {
      const paymentMethod = new PaymentMethod({
        id: new Id("pm-1"),
        name: "Updated Card",
        icon: "🏦",
        color: "#000",
      });
      mockHttp.patch.mockResolvedValue({
        success: false,
        error: "Failed to update",
      });
      await expect(repository.update(paymentMethod)).rejects.toThrow(
        "Failed to fetch data",
      );
    });
  });

  describe("delete", () => {
    it("should delete the payment method successfully", async () => {
      mockHttp.delete.mockResolvedValue({ success: true });
      await expect(repository.delete(new Id("pm-1"))).resolves.toBeUndefined();
      expect(mockHttp.delete).toHaveBeenCalledWith(
        "/api/me/payment-methods/pm-1",
      );
    });

    it("should throw an error if delete fails", async () => {
      mockHttp.delete.mockResolvedValue({
        success: false,
        error: "Failed to delete",
      });
      await expect(repository.delete(new Id("pm-1"))).rejects.toThrow(
        "Failed to delete",
      );
    });
  });
});
