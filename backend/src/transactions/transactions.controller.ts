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
import { Id } from '@src/common/domain';
import { ApiResponse } from '@nestjs/swagger';
import { TransactionsErrorCodes } from '@src/transactions/errors';
import { CategoriesErrorCodes } from '@src/categories/errors';
import { PaymentMethodsErrorCodes } from '@src/payment-methods/errors';
import { Response } from 'express';

@Controller('me/transactions')
export class TransactionsController extends SecureController {
  constructor(private readonly transactionsService: TransactionsService) {
    super();
  }

  @Post()
  @ApiResponse({ type: TransactionResponseDto })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const transaction = await this.transactionsService.create(
        new Id(req.user.userId),
        createTransactionDto,
      );
      return res.status(200).send(new TransactionResponseDto(transaction));
    } catch (error) {
      this.handleTransactionsError(res, error);
    }
  }

  @Get()
  @ApiResponse({ type: TransactionsResponseDto })
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
  @ApiResponse({ type: TransactionResponseDto })
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
  @ApiResponse({ type: TransactionResponseDto })
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() transactionDto: UpdateTransactionDto,
  ) {
    try {
      const transaction = await this.transactionsService.update(
        new Id(req.user.userId),
        {
          ...transactionDto,
          id: new Id(id),
        },
      );
      return res.status(200).send(new TransactionResponseDto(transaction));
    } catch (error) {
      this.handleTransactionsError(res, error);
    }
  }

  @Delete(':id')
  @ApiResponse({ type: DeleteTransactionResponseDto })
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
