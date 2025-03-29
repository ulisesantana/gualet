import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth';

import { CategoriesService } from './categories.service';
import {
  CategoriesResponseDto,
  CategoryResponseDto,
  CreateCategoryDto,
  SaveCategoryDto,
} from './dto';
import {
  AuthenticatedRequest,
  BaseController,
} from '@src/common/infrastructure';
import { ApiResponse } from '@nestjs/swagger';
import { Category } from './category.model';
import { Id } from '@src/common/domain';
import { CategoriesErrorCodes } from './errors';

@Controller('me/categories')
export class CategoriesController extends BaseController {
  constructor(private readonly categoryService: CategoriesService) {
    super();
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CategoriesResponseDto })
  async findAll(@Req() req: AuthenticatedRequest) {
    const categories = await this.categoryService.findAll(req.user.userId);
    return new CategoriesResponseDto(categories);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CategoriesResponseDto })
  async findOne(@Req() req: AuthenticatedRequest, @Param() id: string) {
    try {
      const category = await this.categoryService.findOne(
        new Id(id),
        new Id(req.user.userId),
      );
      return new CategoryResponseDto(category);
    } catch (error) {
      console.error('Error finding category:', error);
      this.handleCategoriesError(error);
    }
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CategoryResponseDto })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() category: CreateCategoryDto,
  ) {
    const newCategory = await this.categoryService.create(
      req.user.userId,
      new Category(category),
    );

    return new CategoryResponseDto(newCategory);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async save(
    @Req() req: AuthenticatedRequest,
    @Param() id: string,
    @Body() category: SaveCategoryDto,
  ): Promise<CategoryResponseDto> {
    try {
      const newCategory = await this.categoryService.save(
        req.user.userId,
        new Category({
          ...category,
          icon: category.icon ?? null,
          color: category.color ?? null,
          id: new Id(id),
        }),
      );

      return new CategoryResponseDto(newCategory);
    } catch (error) {
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
