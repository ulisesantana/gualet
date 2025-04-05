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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  static mapToDomain(category: CategoryEntity): Category {
    return new Category(category);
  }

  async findOne(id: Id, userId: Id): Promise<Category> {
    const category = await this.repository.findOneBy({
      id: id.toString(),
    });

    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    if (!userId.equals(category.user.id)) {
      throw new NotAuthorizedForCategoryError(id);
    }

    return CategoriesService.mapToDomain(category);
  }

  async findAll(userId: string): Promise<Category[]> {
    const categories = await this.repository.find({
      where: { user: { id: userId } },
    });

    return categories.map(CategoriesService.mapToDomain);
  }

  async create(
    userId: string,
    category: Omit<Category, 'id'>,
  ): Promise<Category> {
    const categoryEntity: CategoryEntity = this.repository.create({
      ...category,
      user: { id: userId },
      id: new Id().toString(),
      icon: category.icon ?? undefined,
      color: category.color ?? undefined,
    });

    const newCategory = await this.repository.save(categoryEntity);
    return CategoriesService.mapToDomain(newCategory);
  }

  async save(userId: string, category: Category): Promise<Category> {
    const existingCategory = await this.repository.findOne({
      where: { id: category.id.toString() },
    });

    if (!existingCategory) {
      throw new CategoryNotFoundError(category.id);
    }

    if (existingCategory.user.id !== userId) {
      throw new NotAuthorizedForCategoryError(category.id);
    }

    const savedCategory = await this.repository.save({
      ...category,
      user: existingCategory.user,
      id: category.id.toString(),
      icon: category.icon ?? undefined,
      color: category.color ?? undefined,
    });
    return CategoriesService.mapToDomain(savedCategory);
  }
}
