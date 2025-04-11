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
import { PaymentMethodsService } from './payment-methods.service';
import { Id } from '@src/common/domain';
import {
  AuthenticatedRequest,
  BaseController,
  ErrorResponse,
} from '@src/common/infrastructure';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
  PaymentMethodsResponseDto,
  UpdatePaymentMethodDto,
} from '@src/payment-methods/dto';
import { PaymentMethodsErrorCodes } from './errors';
import { JwtAuthGuard } from '@src/auth';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

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
      createPaymentMethodDto,
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
    @Res() res: Response,
  ) {
    try {
      const pm = await this.paymentMethodsService.findOne(
        new Id(req.user.userId),
        new Id(id),
      );
      res.status(200).send(new PaymentMethodResponseDto(pm));
    } catch (error) {
      console.error(`Error fetching payment method ${id.toString()}:`, error);
      this.handlePaymentMethodsError(res, error);
    }
  }

  @Patch(':id')
  @ApiResponse({ type: PaymentMethodResponseDto })
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    try {
      const pm = await this.paymentMethodsService.update(
        new Id(req.user.userId),
        { ...updatePaymentMethodDto, id: new Id(id) },
      );
      res.status(200).send(new PaymentMethodResponseDto(pm));
    } catch (error) {
      console.error(`Error saving payment method ${id.toString()}:`, error);
      this.handlePaymentMethodsError(res, error);
    }
  }

  private handlePaymentMethodsError(res: Response, error: any) {
    if (this.isBaseError(error)) {
      switch (error.code) {
        case PaymentMethodsErrorCodes.PaymentMethodNotFound:
          return res
            .status(404)
            .send(new ErrorResponse(new NotFoundException(error.message)));
        case PaymentMethodsErrorCodes.NotAuthorizedForPaymentMethod:
          return res
            .status(403)
            .send(new ErrorResponse(new ForbiddenException(error.message)));
      }
    }
    return res
      .status(500)
      .send(new ErrorResponse(new InternalServerErrorException(error.message)));
  }
}
