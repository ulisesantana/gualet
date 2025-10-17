import { UseCase } from "@application/cases/use-case";
import { UserRepository } from "@application/repositories";
import { CommandResponse } from "@domain/types";

type Input = { email: string; password: string };

type Output = Promise<CommandResponse>;

export class LoginUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  exec(input: Input) {
    return this.userRepository.login(input);
  }
}
