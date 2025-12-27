import { UseCase } from "@common/application/use-case";
import { UserRepository } from "../user.repository";
import { CommandResponse } from "@common/domain/types";

export class LogoutUseCase implements UseCase<never, Promise<CommandResponse>> {
  constructor(private readonly userRepository: UserRepository) {}

  async exec(): Promise<CommandResponse> {
    return this.userRepository.logout();
  }
}
