import { useEffect, useState } from "react";
import { useSession } from "@infrastructure/ui/contexts";
import { supabase } from "@infrastructure/data-sources";
import {
  CategoryRepositoryImplementation,
  LocalStorageRepository,
  PaymentMethodRepositoryImplementation,
  TransactionRepositoryImplementation,
  UserPreferencesRepositoryImplementation,
} from "@infrastructure/repositories";
import {
  CategoryRepository,
  PaymentMethodRepository,
  TransactionRepository,
  UserPreferencesRepository,
} from "@application/repositories";

interface Repositories {
  category: CategoryRepository;
  paymentMethods: PaymentMethodRepository;
  transactions: TransactionRepository;
  userPreferences: UserPreferencesRepository;
}

export function useRepositories() {
  const { session } = useSession();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repositories | null>(null);

  useEffect(() => {
    if (session) {
      setRepositories({
        category: new CategoryRepositoryImplementation(
          session.user.id,
          supabase,
        ),
        paymentMethods: new PaymentMethodRepositoryImplementation(
          session.user.id,
          supabase,
        ),
        transactions: new TransactionRepositoryImplementation(
          session.user.id,
          supabase,
        ),
        userPreferences: new UserPreferencesRepositoryImplementation(
          new LocalStorageRepository("user"),
        ),
      });
      setIsReady(true);
    }
  }, [session]);

  return {
    repositories,
    isReady,
    isLoading,
    setIsLoading,
  };
}
