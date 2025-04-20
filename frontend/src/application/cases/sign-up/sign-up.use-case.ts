import { UseCase } from "@application/cases/use-case";
import { UserRepository } from "@application/repositories";

type Input = { email: string; password: string };
type Output = Promise<boolean>;

export class SignUpUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  async exec(input: Input) {
    try {
      return await this.userRepository.register(input);
    } catch (error) {
      console.error("Error during sign up:", error);
      return false;
    }
  }
}
