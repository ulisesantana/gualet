import { useState } from "react";
import {
  CategoryRepository,
  PaymentMethodRepository,
  TransactionRepository,
  UserPreferencesRepository,
} from "@application/repositories";

interface Repositories {
  category: CategoryRepository;
  paymentMethod: PaymentMethodRepository;
  transaction: TransactionRepository;
  userPreferences: UserPreferencesRepository;
}

export function useRepositories() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repositories | null>(null);

  return {
    repositories,
    isReady,
    isLoading,
    setIsLoading,
  };
}
