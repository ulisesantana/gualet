import { UseCase } from "@application/cases/use-case";
import { SupabaseClient } from "@supabase/supabase-js";

export class LogoutUseCase implements UseCase<never, Promise<void>> {
  constructor(private readonly sb: SupabaseClient) {}

  async exec(): Promise<void> {
    await this.sb.auth.signOut();
  }
}
