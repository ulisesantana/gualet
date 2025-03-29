import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { Category } from '../category.model';

export class CategoryResponseDto {
  @ApiProperty()
  category: CategoryDto;

  constructor(category: Category) {
    this.category = category.toJSON();
  }
}
