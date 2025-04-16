import { UseCase } from "@application/cases/use-case";
import { UserRepository } from "@application/repositories";

type Input = { email: string; password: string };

export class SignUpUseCase implements UseCase<Input, Promise<void>> {
  constructor(private readonly userRepository: UserRepository) {}

  async exec(input: Input): Promise<void> {
    await this.userRepository.register(input);
  }
}
