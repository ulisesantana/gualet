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
export class PaymentMethodsController extends BaseController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {
    super();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: PaymentMethodResponseDto })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaymentMethodResponseDto> {
    try {
      const pm = await this.paymentMethodsService.findOne(
        new Id(id),
        new Id(req.user.userId),
      );
      return new PaymentMethodResponseDto(pm);
    } catch (error) {
      console.error(`Error fetching payment method ${id.toString()}:`, error);
      this.handlePaymentMethodsError(error);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: PaymentMethodResponseDto })
  async save(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() savePaymentMethodDto: SavePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    try {
      const pm = await this.paymentMethodsService.save(
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
