import { Injectable } from '@nestjs/common';
import { User } from './models';
import { Id } from '@gualet/shared';
import { UserNotFoundError } from './errors';

/**
 * Demo User Service - In-memory implementation for demo purposes
 * This service manages a single demo user with predefined data in memory.
 */
@Injectable()
export class DemoUserService {
  private readonly demoUser: User;
  private readonly demoUserId = 'demo-user-id';
  private readonly demoUserEmail = 'demo@gualet.app';

  constructor() {
    this.demoUser = new User({
      id: this.demoUserId,
      email: this.demoUserEmail,
    });
  }

  getDemoUser(): User {
    return this.demoUser;
  }

  async findById(id: Id): Promise<User> {
    if (id.toString() === this.demoUserId) {
      return this.demoUser;
    }
    throw new UserNotFoundError(id);
  }

  getDemoUserId(): string {
    return this.demoUserId;
  }

  isDemoUser(userId: string): boolean {
    return userId === this.demoUserId;
  }
}
