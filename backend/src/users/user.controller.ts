import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { BaseError } from '../common/errors';
import { UserErrorCodes } from './errors/user.error-codes';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      return { user };
    } catch (error) {
      if (
        error instanceof BaseError &&
        error.code === UserErrorCodes.UserNotFound
      ) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
