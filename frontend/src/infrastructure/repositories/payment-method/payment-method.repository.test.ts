import { beforeEach, describe, expect, it, vi } from "vitest";
import { Id, PaymentMethod } from "@domain/models";
import { MockSupabaseClient } from "@test/mocks";
import { SupabaseClient } from "@supabase/supabase-js";

import { PaymentMethodRepositoryImplementation } from "./payment-method.repository";

describe("PaymentMethodRepositoryImplementation", () => {
  let mockSupabaseClient: MockSupabaseClient;
  let paymentMethodRepository: PaymentMethodRepositoryImplementation;
  const userId = "user-123";
  const dbName = "payment_methods";

  beforeEach(() => {
    mockSupabaseClient = new MockSupabaseClient();
    paymentMethodRepository = new PaymentMethodRepositoryImplementation(
      userId,
      mockSupabaseClient as unknown as SupabaseClient,
    );
  });

  describe("save", () => {
    it("should upsert a payment method", async () => {
      const paymentMethod = new PaymentMethod({
        id: new Id("pm-1"),
        name: "Credit Card",
        icon: "💳",
      });

      await paymentMethodRepository.save(paymentMethod);

      expect(mockSupabaseClient.from(dbName).upsert).toHaveBeenCalledWith({
        id: "pm-1",
        user_id: userId,
        name: "Credit Card",
        icon: "💳",
      });
    });

    it("should log an error if upsert fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const paymentMethod = new PaymentMethod({
        id: new Id("pm-1"),
        name: "Credit Card",
        icon: "💳",
      });

      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Upsert failed"),
      });

      await paymentMethodRepository.save(paymentMethod);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Error saving payment method: ${paymentMethod}`,
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("findById", () => {
    it("should fetch a payment method by ID", async () => {
      const paymentMethodData = {
        id: "pm-1",
        name: "Credit Card",
        icon: "💳",
      };
      mockSupabaseClient.withResult({ data: [paymentMethodData], error: null });

      const result = await paymentMethodRepository.findById(new Id("pm-1"));

      expect(result).toEqual(
        new PaymentMethod({
          id: new Id(paymentMethodData.id),
          name: paymentMethodData.name,
          icon: paymentMethodData.icon,
        }),
      );
    });

    it("should return null if payment method is not found", async () => {
      mockSupabaseClient.withResult({ data: [], error: null });

      const result = await paymentMethodRepository.findById(new Id("pm-1"));

      expect(result).toBeNull();
    });

    it("should return null if there is an error fetching by ID", async () => {
      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Fetch failed"),
      });

      const result = await paymentMethodRepository.findById(new Id("pm-1"));

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should fetch all payment methods for the user", async () => {
      const paymentMethodsData = [
        { id: "pm-1", name: "Credit Card", icon: "💳" },
        { id: "pm-2", name: "Cash", icon: "💵" },
      ];
      mockSupabaseClient.withResult({ data: paymentMethodsData, error: null });

      const result = await paymentMethodRepository.findAll();

      expect(result).toEqual(
        paymentMethodsData.map(
          (p) => new PaymentMethod({ ...p, id: new Id(p.id) }),
        ),
      );
      expect(mockSupabaseClient.from(dbName).select).toHaveBeenCalledWith();
    });

    it("should return an empty array if there is an error fetching all payment methods", async () => {
      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Fetch failed"),
      });

      const result = await paymentMethodRepository.findAll();

      expect(result).toEqual([]);
    });
  });
});
