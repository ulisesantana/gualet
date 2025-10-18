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
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { Id } from '@gualet/shared';
import {
  AuthenticatedRequest,
  ErrorResponse,
  SecureController,
} from '@src/common/infrastructure';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
  PaymentMethodsResponseDto,
  UpdatePaymentMethodDto,
} from '@src/payment-methods/dto';
import { PaymentMethodsErrorCodes } from './errors';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Payment Methods')
@ApiBearerAuth()
@Controller('me/payment-methods')
export class PaymentMethodsController extends SecureController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method created successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Get all user payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully',
    type: PaymentMethodsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<PaymentMethodsResponseDto> {
    const pms = await this.paymentMethodsService.findAll(
      new Id(req.user.userId),
    );
    return new PaymentMethodsResponseDto(pms);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment method found',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Payment method belongs to another user',
  })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
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
  @ApiOperation({ summary: 'Update a payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Payment method belongs to another user',
  })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
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
