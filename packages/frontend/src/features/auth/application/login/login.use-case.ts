import { UseCase } from "@common/application/use-case";
import { CommandResponse } from "@common/domain/types";

import { UserRepository } from "../user.repository";

type Input = { email: string; password: string };

type Output = Promise<CommandResponse>;

export class LoginUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  exec(input: Input) {
    return this.userRepository.login(input);
  }
}
