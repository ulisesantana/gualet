import { Injectable } from '@nestjs/common';
import { Category, Id } from '@gualet/shared';
import { DemoService } from '../demo.service';
import {
  CategoryInUseError,
  CategoryNotFoundError,
  DuplicateCategoryError,
} from '@src/categories/errors';
import { CategoryToUpdate } from '@src/categories/categories.service';

@Injectable()
export class DemoCategoriesRepository {
  constructor(private readonly demoService: DemoService) {}

  async findOne(userId: Id, id: Id): Promise<Category> {
    const categories = this.demoService.getCategories();
    const category = categories.get(id.toString());

    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    return category;
  }

  async findAll(userId: Id): Promise<Category[]> {
    const categories = this.demoService.getCategories();
    return Array.from(categories.values());
  }

  async create(userId: Id, category: Category): Promise<Category> {
    const categories = this.demoService.getCategories();

    // Check for duplicate category name with same type
    const existingCategory = Array.from(categories.values()).find(
      (c) => c.name === category.name && c.type === category.type,
    );

    if (existingCategory) {
      throw new DuplicateCategoryError(category.name);
    }

    categories.set(category.id.toString(), category);
    return category;
  }

  async update(userId: Id, category: CategoryToUpdate): Promise<Category> {
    const categories = this.demoService.getCategories();
    const existingCategory = categories.get(category.id.toString());

    if (!existingCategory) {
      throw new CategoryNotFoundError(category.id);
    }

    // Create updated category
    const updatedCategory = new Category({
      id: category.id,
      name: category.name ?? existingCategory.name,
      type: category.type ?? existingCategory.type,
      icon: category.icon ?? existingCategory.icon,
      color: category.color ?? existingCategory.color,
    });

    categories.set(category.id.toString(), updatedCategory);
    return updatedCategory;
  }

  async delete(userId: Id, categoryId: Id): Promise<void> {
    const categories = this.demoService.getCategories();
    const transactions = this.demoService.getTransactions();

    const category = categories.get(categoryId.toString());
    if (!category) {
      throw new CategoryNotFoundError(categoryId);
    }

    // Check if category is in use
    const categoryInUse = Array.from(transactions.values()).some(
      (tx) => tx.categoryId === categoryId.toString(),
    );

    if (categoryInUse) {
      throw new CategoryInUseError(categoryId);
    }

    categories.delete(categoryId.toString());
  }
}
