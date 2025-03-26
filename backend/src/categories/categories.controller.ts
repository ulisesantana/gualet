import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

import { CategoriesService } from './categories.service';
import { CreateCategoryRequestDto } from './dto';
import { OperationType } from '../common/types';

@Controller('me/categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.categoryService.findAllForUser(req.user.userId);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() category: CreateCategoryRequestDto,
  ) {
    if (
      category.type !== OperationType.Income &&
      category.type !== OperationType.Outcome
    ) {
      throw new BadRequestException('Invalid operation type');
    }

    return this.categoryService.create({
      ...category,
      user_id: req.user.userId,
    });
  }
}
