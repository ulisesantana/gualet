export * from "./http";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
