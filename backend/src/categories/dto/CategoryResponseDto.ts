import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../entities';
import { CategoryDto } from './CategoryDto';

export class CategoryResponseDto {
  @ApiProperty()
  category: CategoryDto;

  constructor(category: CategoryEntity) {
    this.category = {
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.icon,
    };
  }
}
