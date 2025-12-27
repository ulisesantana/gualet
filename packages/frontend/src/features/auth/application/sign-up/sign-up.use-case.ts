import { UseCase } from "@common/application/use-case";
import { UserRepository } from "../user.repository";
import { CommandResponse } from "@common/domain/types";

type Input = { email: string; password: string };
type Output = Promise<CommandResponse>;

export class SignUpUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  exec(input: Input) {
    return this.userRepository.register(input);
  }
}
