import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  findAllForUser(userId: string) {
    return this.categoryRepository.find({ where: { user_id: userId } });
  }

  create(category: Omit<CategoryEntity, 'id'>) {
    return this.categoryRepository.save(category);
  }
}
