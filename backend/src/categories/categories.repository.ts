import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities';
import { Category } from './category.model';
import { Id } from '@src/common/domain';
import {
  CategoryNotFoundError,
  NotAuthorizedForCategoryError,
} from '@src/categories/errors';
import { CategoryToUpdate } from './categories.service';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  static mapToDomain(category: CategoryEntity): Category {
    return new Category(category);
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
}
