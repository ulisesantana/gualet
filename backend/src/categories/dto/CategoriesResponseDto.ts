import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../entities';
import { CategoryDto } from './CategoryDto';

export class CategoriesResponseDto {
  @ApiProperty()
  categories: CategoryDto[];

  constructor(categories: CategoryEntity[]) {
    this.categories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.icon,
    }));
  }
}
