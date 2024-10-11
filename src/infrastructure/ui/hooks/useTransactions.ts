import { useEffect, useState } from "react";
import { useSession } from "@infrastructure/ui/contexts";
import { TransactionRepositoryImplementation } from "@infrastructure/repositories";
import { defaultTransactionConfig, TransactionConfig } from "@domain/models";
import { supabase } from "@infrastructure/data-sources";
import { GetTransactionConfig } from "@application/cases";

export function useTransactions() {
  const { session } = useSession();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [repository, setRepository] =
    useState<TransactionRepositoryImplementation | null>(null);
  const [transactionConfig, setTransactionConfig] = useState<TransactionConfig>(
    defaultTransactionConfig,
  );

  useEffect(() => {
    if (session) {
      const transactionRepositoryImplementation =
        new TransactionRepositoryImplementation(session.user.id, supabase);
      setRepository(transactionRepositoryImplementation);
      new GetTransactionConfig(transactionRepositoryImplementation)
        .exec()
        .then(setTransactionConfig)
        .finally(() => setIsReady(true));
    }
  }, [session]);

  return {
    repository,
    transactionConfig,
    isReady,
  };
}
