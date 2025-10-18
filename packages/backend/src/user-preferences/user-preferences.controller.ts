import { Body, Controller, Get, Put, Req, Res } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { Id } from '@src/common/domain';
import {
  AuthenticatedRequest,
  SecureController,
} from '@src/common/infrastructure';
import { UserPreferencesDto } from './dto';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

interface UserPreferencesResponse {
  success: boolean;
  data: {
    preferences: {
      defaultPaymentMethod: {
        id: string;
        name: string;
        icon: string;
        color: string;
      };
    };
  };
}

@Controller('me/preferences')
export class UserPreferencesController extends SecureController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {
    super();
  }

  @Get()
  @ApiResponse({ type: UserPreferencesDto })
  async find(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const preferences = await this.userPreferencesService.find(
        new Id(req.user.userId),
      );

      const response: UserPreferencesResponse = {
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: preferences.defaultPaymentMethod.id.value,
              name: preferences.defaultPaymentMethod.name,
              icon: preferences.defaultPaymentMethod.icon ?? '',
              color: preferences.defaultPaymentMethod.color ?? '',
            },
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user preferences',
        },
      });
    }
  }

  @Put()
  @ApiResponse({ type: UserPreferencesDto })
  async save(
    @Body() dto: UserPreferencesDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const preferences = await this.userPreferencesService.save(
        new Id(req.user.userId),
        new Id(dto.defaultPaymentMethodId),
      );

      const response: UserPreferencesResponse = {
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: preferences.defaultPaymentMethod.id.value,
              name: preferences.defaultPaymentMethod.name,
              icon: preferences.defaultPaymentMethod.icon ?? '',
              color: preferences.defaultPaymentMethod.color ?? '',
            },
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save user preferences',
        },
      });
    }
  }
}
