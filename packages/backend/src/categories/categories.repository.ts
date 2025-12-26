import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CategoryInUseError,
  CategoryNotFoundError,
  DuplicateCategoryError,
  NotAuthorizedForCategoryError,
} from '@src/categories/errors';
import { CategoryToUpdate } from './categories.service';
import { CategoryEntity, TransactionEntity } from '@src/db';
import { Category, Id } from '@gualet/shared';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  static mapToDomain(category: CategoryEntity): Category {
    return new Category({
      id: new Id(category.id),
      name: category.name,
      type: category.type,
      icon: category.icon ?? '',
      color: category.color ?? '',
    });
  }

  async findOne(userId: Id, id: Id): Promise<Category> {
    const category = await this.repository.findOne({
      where: { id: id.toString() },
      relations: ['user'],
    });

    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    if (!userId.equals(category.user.id)) {
      throw new NotAuthorizedForCategoryError(id);
    }

    return CategoriesRepository.mapToDomain(category);
  }

  async findAll(userId: Id): Promise<Category[]> {
    const categories = await this.repository.find({
      where: { user: { id: userId.toString() } },
    });

    return categories.map(CategoriesRepository.mapToDomain);
  }

  async create(userId: Id, category: Category): Promise<Category> {
    // Check for duplicate category name with same type for this user
    const existingCategory = await this.repository.findOne({
      where: {
        user: { id: userId.toString() },
        name: category.name,
        type: category.type,
      },
    });

    if (existingCategory) {
      throw new DuplicateCategoryError(category.name);
    }

    const categoryEntity: CategoryEntity = this.repository.create({
      id: category.id.toString(),
      name: category.name,
      type: category.type,
      icon: category.icon || undefined,
      color: category.color || undefined,
      user: { id: userId.toString() },
    });

    const newCategory = await this.repository.save(categoryEntity);
    return CategoriesRepository.mapToDomain(newCategory);
  }

  async update(userId: Id, category: CategoryToUpdate): Promise<Category> {
    const existingCategory = await this.repository.findOne({
      where: { id: category.id.toString() },
      relations: ['user'],
    });

    if (!existingCategory) {
      throw new CategoryNotFoundError(category.id);
    }

    if (existingCategory.user.id !== userId.toString()) {
      throw new NotAuthorizedForCategoryError(category.id);
    }

    const savedCategory = await this.repository.save({
      ...existingCategory,
      ...category,
      ...this.handleNullableFields(category, existingCategory),
      user: existingCategory.user,
      id: category.id.toString(),
    });
    return CategoriesRepository.mapToDomain(savedCategory);
  }

  async delete(userId: Id, id: Id): Promise<void> {
    const category = await this.repository.findOne({
      where: { id: id.toString() },
      relations: ['user'],
    });

    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    if (category.user.id !== userId.toString()) {
      throw new NotAuthorizedForCategoryError(id);
    }

    // Check if category is being used by any transactions
    const transactionCount = await this.transactionRepository.count({
      where: { category: { id: id.toString() } },
    });

    if (transactionCount > 0) {
      throw new CategoryInUseError(id);
    }

    await this.repository.delete({ id: id.toString() });
  }

  private handleNullableFields(
    toUpdate: CategoryToUpdate,
    existing?: CategoryEntity,
  ) {
    return {
      icon:
        toUpdate.icon === null ? undefined : toUpdate.icon || existing?.icon,
      color:
        toUpdate.color === null ? undefined : toUpdate.color || existing?.color,
    };
  }
}
