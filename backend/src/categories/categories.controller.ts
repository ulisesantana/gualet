import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CategoriesService } from './categories.service';
import {
  CategoriesResponseDto,
  CategoryResponseDto,
  CreateCategoryRequestDto,
  SaveCategoryRequestDto,
} from './dto';
import { AuthenticatedRequest } from '../common/types';
import { ApiResponse } from '@nestjs/swagger';

@Controller('me/categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CategoriesResponseDto })
  async findAll(@Req() req: AuthenticatedRequest) {
    const categories = await this.categoryService.findAllForUser(
      req.user.userId,
    );
    return new CategoriesResponseDto(categories);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CategoryResponseDto })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() category: CreateCategoryRequestDto,
  ) {
    const newCategory = await this.categoryService.create({
      ...category,
      user_id: req.user.userId,
    });

    return new CategoryResponseDto(newCategory);
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  async save(
    @Req() req: AuthenticatedRequest,
    @Body() category: SaveCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const newCategory = await this.categoryService.save({
      ...category,
      user_id: req.user.userId,
    });

    return new CategoryResponseDto(newCategory);
  }
}
