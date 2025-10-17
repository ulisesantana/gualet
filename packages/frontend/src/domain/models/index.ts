export * from "./report/report";
export * from "./report/categoryReport";

// Re-export from core for convenience (not as type-only to allow using as constructors)
export {
  Id,
  Day,
  Transaction,
  PaymentMethod,
  defaultTransactionConfig,
  defaultUserPreferences,
} from "@gualet/core";

// Re-export types that need 'export type' for isolatedModules
export type { TransactionConfig, UserPreferences } from "@gualet/core";
