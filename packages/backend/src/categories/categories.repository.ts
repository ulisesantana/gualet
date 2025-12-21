import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CategoryNotFoundError,
  NotAuthorizedForCategoryError,
  CategoryInUseError,
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
    const category = await this.repository.findOneBy({
      id: id.toString(),
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
    const categoryEntity: CategoryEntity = this.repository.create({
      ...category.toJSON(),
      ...this.handleNullableFields(category),
      user: { id: userId.toString() },
    });

    const newCategory = await this.repository.save(categoryEntity);
    return CategoriesRepository.mapToDomain(newCategory);
  }

  async update(userId: Id, category: CategoryToUpdate): Promise<Category> {
    const existingCategory = await this.repository.findOne({
      where: { id: category.id.toString() },
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

  async delete(userId: Id, id: Id): Promise<void> {
    const category = await this.repository.findOne({
      where: { id: id.toString() },
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
}
