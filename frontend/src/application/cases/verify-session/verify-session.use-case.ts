import { UseCase } from "@application/cases/use-case";
import { UserRepository } from "@application/repositories";
import { CommandResponse } from "@domain/types";

type Input = undefined;

type Output = Promise<CommandResponse>;

export class VerifySessionUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  async exec(_input?: Input) {
    return await this.userRepository.verify();
  }
}
