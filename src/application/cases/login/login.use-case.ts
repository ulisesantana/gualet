import { UseCase } from "@application/cases/use-case";
import { SupabaseClient } from "@supabase/supabase-js";

type Input = { email: string; password: string };

export class LoginUseCase implements UseCase<Input, Promise<void>> {
  constructor(private readonly sb: SupabaseClient) {}

  async exec(input: Input): Promise<void> {
    await this.sb.auth.signInWithPassword(input);
  }
}
