import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserPreferencesRepository } from './user-preferences.repository';
import { DemoUserPreferencesRepository } from '@src/demo/repositories';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { Id, Nullable } from '@gualet/shared';
import { UserPreferences } from './user-preferences.model';

export interface IUserPreferencesRepository {
  findByUserId(userId: Id): Promise<Nullable<UserPreferences>>;
  save(
    userId: Id,
    defaultPaymentMethodId: Id,
    language?: 'en' | 'es',
  ): Promise<UserPreferences>;
}

@Injectable({ scope: Scope.REQUEST })
export class UserPreferencesRepositoryFactory {
  constructor(
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
    private readonly dbRepository: UserPreferencesRepository,
    private readonly demoRepository: DemoUserPreferencesRepository,
  ) {}

  getRepository(): IUserPreferencesRepository {
    if (this.request.user?.isDemo) {
      return this.demoRepository as IUserPreferencesRepository;
    }
    return this.dbRepository as IUserPreferencesRepository;
  }
}
