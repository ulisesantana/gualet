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
  Res,
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
  BaseResponse,
} from '@src/common/infrastructure';
import { ApiResponse } from '@nestjs/swagger';
import { Id } from '@src/common/domain';
import { CategoriesErrorCodes } from './errors';
import { Response } from 'express';

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
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param() id: string,
  ) {
    try {
      const category = await this.categoryService.findOne(
        new Id(req.user.userId),
        new Id(id),
      );
      res.status(200).send(new CategoryResponseDto(category));
    } catch (error) {
      console.error('Error finding category:', error);
      this.handleCategoriesError(res, error);
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
  @ApiResponse({ type: CategoryResponseDto })
  async update(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param() id: string,
    @Body() category: UpdateCategoryDto,
  ) {
    try {
      const newCategory = await this.categoryService.update(
        new Id(req.user.userId),
        {
          ...category,
          id: new Id(id),
        },
      );

      return res.status(200).send(new CategoryResponseDto(newCategory));
    } catch (error) {
      // TODO: Add logging service
      console.error('Error saving category:', error);
      return this.handleCategoriesError(res, error);
    }
  }

  private handleCategoriesError(res: Response, error: any) {
    if (this.isBaseError(error)) {
      switch (error.code) {
        case CategoriesErrorCodes.CategoryNotFound:
          return res
            .status(404)
            .send(new BaseResponse(null, new NotFoundException(error)));
        case CategoriesErrorCodes.NotAuthorizedForCategory:
          return res
            .status(403)
            .send(new BaseResponse(null, new ForbiddenException(error)));
      }
    }
    return res
      .status(500)
      .send(new BaseResponse(null, new InternalServerErrorException(error)));
  }
}
