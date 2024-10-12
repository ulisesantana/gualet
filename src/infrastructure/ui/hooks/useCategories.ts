import { useEffect, useState } from "react";
import { useSession } from "@infrastructure/ui/contexts";
import { supabase } from "@infrastructure/data-sources";
import { CategoryRepositoryImplementation } from "@infrastructure/repositories/category.repository";

export function useCategories() {
  const { session } = useSession();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [repository, setRepository] =
    useState<CategoryRepositoryImplementation | null>(null);

  useEffect(() => {
    if (session) {
      setRepository(
        new CategoryRepositoryImplementation(session.user.id, supabase),
      );
      setIsReady(true);
    }
  }, [session]);

  return {
    repository,
    isReady,
  };
}
