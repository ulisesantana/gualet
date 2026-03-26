import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoriesResponseDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import {
  AuthenticatedRequest,
  ErrorResponse,
  SecureController,
  SuccessResponse,
} from '@src/common/infrastructure';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Id } from '@gualet/shared';
import { CategoriesErrorCodes } from './errors';
import { Response } from 'express';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('me/categories')
export class CategoriesController extends SecureController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoryService: CategoriesService) {
    super();
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all user categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: CategoriesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: AuthenticatedRequest) {
    const categories = await this.categoryService.findAll(
      new Id(req.user.userId),
    );
    return new CategoriesResponseDto(categories);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Category belongs to another user',
    type: ErrorResponse<ForbiddenException>,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: ErrorResponse<NotFoundException>,
  })
  @ApiResponse({
    status: 500,
    type: ErrorResponse<InternalServerErrorException>,
  })
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const category = await this.categoryService.findOne(
        new Id(req.user.userId),
        new Id(id),
      );
      res.status(200).send(new CategoryResponseDto(category));
    } catch (error) {
      this.logger.error('Error finding category:', error);
      this.handleCategoriesError(res, error);
    }
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 200,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Category with same name and type already exists',
    type: ErrorResponse<ConflictException>,
  })
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
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Category belongs to another user',
    type: ErrorResponse<ForbiddenException>,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: ErrorResponse<NotFoundException>,
  })
  @ApiResponse({
    status: 500,
    type: ErrorResponse<InternalServerErrorException>,
  })
  async update(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
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

      res.status(200).send(new CategoryResponseDto(newCategory));
    } catch (error) {
      this.logger.error('Error saving category:', error);
      return this.handleCategoriesError(res, error);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    type: SuccessResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Category belongs to another user',
    type: ErrorResponse<ForbiddenException>,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: ErrorResponse<NotFoundException>,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Category is in use by transactions',
    type: ErrorResponse<ConflictException>,
  })
  @ApiResponse({
    status: 500,
    type: ErrorResponse<InternalServerErrorException>,
  })
  async delete(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      await this.categoryService.delete(new Id(req.user.userId), new Id(id));

      res.status(204).send();
    } catch (error) {
      this.logger.error('Error deleting category:', error);
      return this.handleCategoriesError(res, error);
    }
  }

  private handleCategoriesError(res: Response, error: any) {
    if (this.isBaseError(error)) {
      switch (error.code) {
        case CategoriesErrorCodes.CategoryNotFound: {
          res.status(404).send(new ErrorResponse(new NotFoundException(error)));
          break;
        }
        case CategoriesErrorCodes.NotAuthorizedForCategory: {
          res
            .status(403)
            .send(new ErrorResponse(new ForbiddenException(error)));
          break;
        }
        case CategoriesErrorCodes.CategoryInUse: {
          res.status(409).send(new ErrorResponse(new ConflictException(error)));
          break;
        }
      }
    } else {
      res
        .status(500)
        .send(new ErrorResponse(new InternalServerErrorException(error)));
    }
  }
}
