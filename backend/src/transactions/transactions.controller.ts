import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { Id } from '@src/common/domain';
import { JwtAuthGuard } from '@src/auth';
import { ApiResponse } from '@nestjs/swagger';

@Controller('me/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

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
      throw new InternalServerErrorException(
        new TransactionResponseDto(null, error),
      );
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
      throw new InternalServerErrorException(
        new TransactionsResponseDto(null, error),
      );
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
      throw new InternalServerErrorException(
        new TransactionResponseDto(null, error),
      );
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
      throw new InternalServerErrorException(
        new TransactionResponseDto(null, error),
      );
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
      throw new InternalServerErrorException(
        new DeleteTransactionResponseDto(error),
      );
    }
  }
}
