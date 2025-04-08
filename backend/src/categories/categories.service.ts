import { Injectable } from '@nestjs/common';
import { Category } from './category.model';
import { Id, OperationType } from '@src/common/domain';
import { CategoriesRepository } from './categories.repository';
import { Nullable } from '@src/common/types';

export type CategoryToUpdate = Partial<Category> & { id: Id };

interface CategoryToCreate {
  name: string;
  type: OperationType;
  icon?: Nullable<string>;
  color?: Nullable<string>;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  findOne(userId: Id, id: Id): Promise<Category> {
    return this.repository.findOne(userId, id);
  }

  findAll(userId: Id): Promise<Category[]> {
    return this.repository.findAll(userId);
  }

  create(userId: Id, category: CategoryToCreate): Promise<Category> {
    return this.repository.create(
      userId,
      new Category({
        ...category,
        id: new Id().toString(),
      }),
    );
  }

  update(userId: Id, category: CategoryToUpdate): Promise<Category> {
    return this.repository.update(userId, category);
  }
}
