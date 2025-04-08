import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth';

import { CategoriesService } from './categories.service';
import {
  CategoriesResponseDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import {
  AuthenticatedRequest,
  BaseController,
} from '@src/common/infrastructure';
import { ApiResponse } from '@nestjs/swagger';
import { Id } from '@src/common/domain';
import { CategoriesErrorCodes } from './errors';

@Controller('me/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController extends BaseController {
  constructor(private readonly categoryService: CategoriesService) {
    super();
  }

  @Get('/')
  @ApiResponse({ type: CategoriesResponseDto })
  async findAll(@Req() req: AuthenticatedRequest) {
    const categories = await this.categoryService.findAll(
      new Id(req.user.userId),
    );
    return new CategoriesResponseDto(categories);
  }

  @Get('/:id')
  @ApiResponse({ type: CategoriesResponseDto })
  async findOne(@Req() req: AuthenticatedRequest, @Param() id: string) {
    try {
      const category = await this.categoryService.findOne(
        new Id(req.user.userId),
        new Id(id),
      );
      return new CategoryResponseDto(category);
    } catch (error) {
      console.error('Error finding category:', error);
      this.handleCategoriesError(error);
    }
  }

  @Post('/')
  @ApiResponse({ type: CategoryResponseDto })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() category: CreateCategoryDto,
  ) {
    const newCategory = await this.categoryService.create(
      new Id(req.user.userId),
      category,
    );

    return new CategoryResponseDto(newCategory);
  }

  @Patch('/:id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param() id: string,
    @Body() category: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    try {
      const newCategory = await this.categoryService.update(
        new Id(req.user.userId),
        {
          ...category,
          id: new Id(id),
        },
      );

      return new CategoryResponseDto(newCategory);
    } catch (error) {
      // TODO: Add logging service
      console.error('Error saving category:', error);
      this.handleCategoriesError(error);
    }
  }

  private handleCategoriesError(error: any): never {
    if (this.isBaseError(error)) {
      switch (error.code) {
        case CategoriesErrorCodes.CategoryNotFound:
          throw new NotFoundException(error.message);
        case CategoriesErrorCodes.NotAuthorizedForCategory:
          throw new ForbiddenException(error.message);
      }
    }
    throw new InternalServerErrorException(error);
  }
}
