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
  UseGuards,
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
  BaseController,
} from '@src/common/infrastructure';
import { Id } from '@src/common/domain';
import { JwtAuthGuard } from '@src/auth';
import { ApiResponse } from '@nestjs/swagger';
import { TransactionsErrorCodes } from '@src/transactions/errors';
import { CategoriesErrorCodes } from '@src/categories/errors';
import { PaymentMethodsErrorCodes } from '@src/payment-methods/errors';

@Controller('me/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController extends BaseController {
  constructor(private readonly transactionsService: TransactionsService) {
    super();
  }

  @Post()
  @ApiResponse({ type: TransactionResponseDto })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TransactionResponseDto> {
    try {
      const transaction = await this.transactionsService.create(
        new Id(req.user.userId),
        createTransactionDto,
      );
      return new TransactionResponseDto(transaction);
    } catch (error) {
      this.handleTransactionsError(error, TransactionResponseDto);
    }
  }

  @Get()
  @ApiResponse({ type: TransactionsResponseDto })
  async findAll(
    @Query() criteria: FindTransactionsCriteria,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const { transactions, pagination } = await this.transactionsService.find(
        new Id(req.user.userId),
        criteria,
      );
      return new TransactionsResponseDto(transactions, null, pagination);
    } catch (error) {
      this.handleTransactionsError(error, TransactionsResponseDto);
    }
  }

  @Get('/:id')
  @ApiResponse({ type: TransactionResponseDto })
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    try {
      const transaction = await this.transactionsService.findById(
        new Id(req.user.userId),
        new Id(id),
      );
      return new TransactionResponseDto(transaction);
    } catch (error) {
      this.handleTransactionsError(error, TransactionResponseDto);
    }
  }

  @Patch(':id')
  @ApiResponse({ type: TransactionResponseDto })
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
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
      return new TransactionResponseDto(transaction);
    } catch (error) {
      this.handleTransactionsError(error, TransactionResponseDto);
    }
  }

  @Delete(':id')
  @ApiResponse({ type: DeleteTransactionResponseDto })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    try {
      await this.transactionsService.delete(
        new Id(req.user.userId),
        new Id(id),
      );
      return new DeleteTransactionResponseDto();
    } catch (error) {
      this.handleTransactionsError(error, DeleteTransactionResponseDto);
    }
  }

  private handleTransactionsError(
    error: any,
    DtoConstructor: new (...args: any[]) => any,
  ): never {
    if (this.isBaseError(error)) {
      switch (error.code) {
        case TransactionsErrorCodes.TransactionNotFound:
        case CategoriesErrorCodes.CategoryNotFound:
        case PaymentMethodsErrorCodes.PaymentMethodNotFound:
          throw new NotFoundException(new DtoConstructor(null, error));
        case TransactionsErrorCodes.NotAuthorizedForTransaction:
        case CategoriesErrorCodes.NotAuthorizedForCategory:
        case PaymentMethodsErrorCodes.NotAuthorizedForPaymentMethod:
          throw new ForbiddenException(new DtoConstructor(null, error));
      }
    }
    throw new InternalServerErrorException(new DtoConstructor(null, error));
  }
}
