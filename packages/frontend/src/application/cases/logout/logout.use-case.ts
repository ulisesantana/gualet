import { UseCase } from "@application/cases/use-case";
import { UserRepository } from "@application/repositories";
import { CommandResponse } from "@domain/types";

export class LogoutUseCase implements UseCase<never, Promise<CommandResponse>> {
  constructor(private readonly userRepository: UserRepository) {}

  async exec(): Promise<CommandResponse> {
    return this.userRepository.logout();
  }
}
