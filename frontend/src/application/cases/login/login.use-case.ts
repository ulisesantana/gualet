import { UseCase } from "@application/cases/use-case";
import { UserRepository } from "@application/repositories";

type Input = { email: string; password: string };

type Output = Promise<boolean>;

export class LoginUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  async exec(input: Input) {
    try {
      return await this.userRepository.login(input);
    } catch (error) {
      console.error("Error login user:", error);
      return false;
    }
  }
}
