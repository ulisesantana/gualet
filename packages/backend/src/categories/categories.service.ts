import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import {
  Category,
  generateDefaultCategories,
  Id,
  Nullable,
  OperationType,
} from '@gualet/shared';

export type CategoryToUpdate = Omit<Partial<Category>, 'icon' | 'color'> & {
  id: Id;
  icon?: Nullable<string>;
  color?: Nullable<string>;
};

interface CategoryToCreate {
  id: string;
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
        id: new Id(category.id),
        icon: category.icon ? category.icon?.trim() : '',
        color: category.color ? category.color?.trim() : '',
      }),
    );
  }

  update(userId: Id, category: CategoryToUpdate): Promise<Category> {
    return this.repository.update(userId, category);
  }

  delete(userId: Id, id: Id): Promise<void> {
    return this.repository.delete(userId, id);
  }

  // TODO: Test this method and use it on user creation
  async createDefaultCategories(userId: Id): Promise<Category[]> {
    const promises = generateDefaultCategories().map((category) =>
      this.create(userId, {
        id: new Id().toString(),
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
