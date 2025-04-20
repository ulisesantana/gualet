import { UseCase } from "@application/cases/use-case";
import { UserRepository } from "@application/repositories";

type Input = undefined;

type Output = Promise<boolean>;

export class VerifySessionUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  async exec(_input?: Input) {
    try {
      return await this.userRepository.verify();
    } catch (error) {
      console.error("Error verifying session:", error);
      return false;
    }
  }
}
