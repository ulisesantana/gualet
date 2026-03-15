import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  DeleteTransactionResponseDto,
  FindTransactionsCriteria,
  TransactionResponseDto,
  TransactionsResponseDto,
  UpdateTransactionDto,
} from './dto';
import {
  AuthenticatedRequest,
  ErrorResponse,
  SecureController,
} from '@src/common/infrastructure';
import { Id } from '@gualet/shared';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionsErrorCodes } from '@src/transactions/errors';
import { CategoriesErrorCodes } from '@src/categories/errors';
import { PaymentMethodsErrorCodes } from '@src/payment-methods/errors';
import { Response } from 'express';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('me/transactions')
export class TransactionsController extends SecureController {
  constructor(private readonly transactionsService: TransactionsService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Category or payment method not found',
  })
  async create(
    @Body() { id, ...dto }: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const transaction = await this.transactionsService.create(
        new Id(req.user.userId),
        { ...dto, id: new Id(id) },
      );
      return res.status(200).send(new TransactionResponseDto(transaction));
    } catch (error) {
      this.handleTransactionsError(res, error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all user transactions with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: TransactionsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() criteria: FindTransactionsCriteria,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const { transactions, pagination } = await this.transactionsService.find(
        new Id(req.user.userId),
        criteria,
      );
      return res
        .status(200)
        .send(new TransactionsResponseDto(transactions, pagination));
    } catch (error) {
      this.handleTransactionsError(res, error);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Transaction belongs to another user',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const transaction = await this.transactionsService.findById(
        new Id(req.user.userId),
        new Id(id),
      );
      return res.status(200).send(new TransactionResponseDto(transaction));
    } catch (error) {
      this.handleTransactionsError(res, error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Transaction belongs to another user',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction, category, or payment method not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const transaction = await this.transactionsService.update(
        new Id(req.user.userId),
        {
          ...updateTransactionDto,
          id: new Id(id),
        },
      );
      return res.status(200).send(new TransactionResponseDto(transaction));
    } catch (error) {
      this.handleTransactionsError(res, error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction deleted successfully',
    type: DeleteTransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Transaction belongs to another user',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      await this.transactionsService.delete(
        new Id(req.user.userId),
        new Id(id),
      );
      return res.status(200).send(new DeleteTransactionResponseDto());
    } catch (error) {
      this.handleTransactionsError(res, error);
    }
  }

  private handleTransactionsError(res: Response, error: any) {
    if (this.isBaseError(error)) {
      switch (error.code) {
        case TransactionsErrorCodes.TransactionNotFound:
        case CategoriesErrorCodes.CategoryNotFound:
        case PaymentMethodsErrorCodes.PaymentMethodNotFound:
          return res
            .status(404)
            .send(new ErrorResponse(new NotFoundException(error)));
        case TransactionsErrorCodes.NotAuthorizedForTransaction:
        case CategoriesErrorCodes.NotAuthorizedForCategory:
        case PaymentMethodsErrorCodes.NotAuthorizedForPaymentMethod:
          return res
            .status(403)
            .send(new ErrorResponse(new ForbiddenException(error)));
      }
    }
    return res
      .status(500)
      .send(new ErrorResponse(new InternalServerErrorException(error)));
  }
}
