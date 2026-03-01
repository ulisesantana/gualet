import { CommandResponse } from "@common/domain/types";

import { UserRepository } from "../user.repository";

export class LoginDemoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  exec(): Promise<CommandResponse> {
    return this.userRepository.loginDemo();
  }
}
