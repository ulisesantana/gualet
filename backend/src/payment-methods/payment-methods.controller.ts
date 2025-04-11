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
import { PaymentMethodsService } from './payment-methods.service';
import { Id } from '@src/common/domain';
import {
  AuthenticatedRequest,
  BaseController,
} from '@src/common/infrastructure';
import { PaymentMethod } from '@src/payment-methods/payment-method.model';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
  PaymentMethodsResponseDto,
  SavePaymentMethodDto,
} from '@src/payment-methods/dto';
import { PaymentMethodsErrorCodes } from './errors';
import { JwtAuthGuard } from '@src/auth';
import { ApiResponse } from '@nestjs/swagger';

@Controller('me/payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodsController extends BaseController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {
    super();
  }

  @Post()
  @ApiResponse({ type: CreatePaymentMethodDto })
  async create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaymentMethodResponseDto> {
    const pm = await this.paymentMethodsService.create(
      new Id(req.user.userId),
      new PaymentMethod(createPaymentMethodDto),
    );
    return new PaymentMethodResponseDto(pm);
  }

  @Get()
  @ApiResponse({ type: PaymentMethodsResponseDto })
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<PaymentMethodsResponseDto> {
    const pms = await this.paymentMethodsService.findAll(
      new Id(req.user.userId),
    );
    return new PaymentMethodsResponseDto(pms);
  }

  @Get(':id')
  @ApiResponse({ type: PaymentMethodResponseDto })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaymentMethodResponseDto> {
    try {
      const pm = await this.paymentMethodsService.findOne(
        new Id(req.user.userId),
        new Id(id),
      );
      return new PaymentMethodResponseDto(pm);
    } catch (error) {
      console.error(`Error fetching payment method ${id.toString()}:`, error);
      this.handlePaymentMethodsError(error);
    }
  }

  @Patch(':id')
  @ApiResponse({ type: PaymentMethodResponseDto })
  async save(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() savePaymentMethodDto: SavePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    try {
      const pm = await this.paymentMethodsService.update(
        new Id(req.user.userId),
        new PaymentMethod({ ...savePaymentMethodDto, id: new Id(id) }),
      );
      return new PaymentMethodResponseDto(pm);
    } catch (error) {
      console.error(`Error saving payment method ${id.toString()}:`, error);
      this.handlePaymentMethodsError(error);
    }
  }

  private handlePaymentMethodsError(error: any): never {
    if (this.isBaseError(error)) {
      switch (error.code) {
        case PaymentMethodsErrorCodes.PaymentMethodNotFound:
          throw new NotFoundException(error.message);
        case PaymentMethodsErrorCodes.NotAuthorizedForPaymentMethod:
          throw new ForbiddenException(error.message);
      }
    }
    throw new InternalServerErrorException(error);
  }
}
