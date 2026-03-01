import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CategoriesRepository } from './categories.repository';
import { DemoCategoriesRepository } from '@src/demo/repositories';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { Category, Id } from '@gualet/shared';
import { CategoryToUpdate } from './categories.service';

export interface ICategoriesRepository {
  findOne(userId: Id, id: Id): Promise<Category>;
  findAll(userId: Id): Promise<Category[]>;
  create(userId: Id, category: Category): Promise<Category>;
  update(userId: Id, category: CategoryToUpdate): Promise<Category>;
  delete(userId: Id, id: Id): Promise<void>;
}

@Injectable({ scope: Scope.REQUEST })
export class CategoriesRepositoryFactory {
  constructor(
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
    private readonly dbRepository: CategoriesRepository,
    private readonly demoRepository: DemoCategoriesRepository,
  ) {}

  getRepository(): ICategoriesRepository {
    if (this.request.user?.isDemo) {
      return this.demoRepository as ICategoriesRepository;
    }
    return this.dbRepository as ICategoriesRepository;
  }
}
