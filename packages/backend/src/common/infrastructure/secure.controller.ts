import { BaseController } from './base.controller';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
export abstract class SecureController extends BaseController {}
