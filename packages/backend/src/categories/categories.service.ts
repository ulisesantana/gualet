import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Nullable } from '@gualet/shared';
import {
  Category,
  generateDefaultCategories,
  Id,
  OperationType,
} from '@gualet/shared';

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
        id: new Id(),
        icon: category.icon ? category.icon?.trim() : '',
        color: category.color ? category.color?.trim() : '',
      }),
    );
  }

  update(userId: Id, category: CategoryToUpdate): Promise<Category> {
    return this.repository.update(userId, category);
  }

  // TODO: Test this method and use it on user creation
  async createDefaultCategories(userId: Id): Promise<Category[]> {
    const promises = generateDefaultCategories().map((category) =>
      this.create(userId, {
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
      }),
    );
    const result = await Promise.allSettled(promises);

    return result.reduce<Category[]>((acc, res) => {
      if (res.status === 'fulfilled') {
        return acc.concat(res.value);
      } else {
        console.error('Failed to create default category:', res.reason);
      }
      return acc;
    }, []);
  }
}
