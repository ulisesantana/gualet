import { UseCase } from "@common/application/use-case";
import { UserRepository } from "../user.repository";
import { CommandResponse } from "@common/domain/types";

type Input = undefined;

export class VerifySessionUseCase
  implements UseCase<Input, Promise<CommandResponse>>
{
  constructor(private readonly userRepository: UserRepository) {}

  async exec(_input?: Input): Promise<CommandResponse> {
    try {
      return await this.userRepository.verify();
    } catch (error) {
      console.error("Error verifying session:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
