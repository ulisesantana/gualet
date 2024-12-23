import { useEffect, useState } from "react";
import { useSession } from "@infrastructure/ui/contexts";
import { StorageDataSource, supabase } from "@infrastructure/data-sources";
import {
  CategoryRepositoryImplementation,
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
  paymentMethod: PaymentMethodRepository;
  transaction: TransactionRepository;
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
        paymentMethod: new PaymentMethodRepositoryImplementation(
          session.user.id,
          supabase,
        ),
        transaction: new TransactionRepositoryImplementation(
          session.user.id,
          supabase,
        ),
        userPreferences: new UserPreferencesRepositoryImplementation(
          new StorageDataSource("user"),
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
