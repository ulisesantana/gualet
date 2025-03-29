import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { Id } from '@src/common/domain';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { PaymentMethod } from '@src/payment-methods/payment-method.model';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
  PaymentMethodsResponseDto,
  SavePaymentMethodDto,
} from '@src/payment-methods/dto';

@Controller('me/payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  async create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const pm = await this.paymentMethodsService.create(
      new Id(req.user.userId),
      new PaymentMethod(createPaymentMethodDto),
    );
    return new PaymentMethodResponseDto(pm);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const pms = await this.paymentMethodsService.findAll(
      new Id(req.user.userId),
    );
    return new PaymentMethodsResponseDto(pms);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.paymentMethodsService.findOne(
      new Id(id),
      new Id(req.user.userId),
    );
  }

  @Post(':id')
  save(
    @Param('id') id: string,
    @Body() savePaymentMethodDto: SavePaymentMethodDto,
  ) {
    const pmId = new Id(id);
    return this.paymentMethodsService.save(
      pmId,
      new PaymentMethod({ ...savePaymentMethodDto, id: pmId }),
    );
  }
}
