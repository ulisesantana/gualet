import {
  Body,
  Controller,
  Get,
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
  FindTransactionsCriteria,
  SaveTransactionDto,
} from './dto';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { Id } from '@src/common/domain';
import { JwtAuthGuard } from '@src/auth';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.transactionsService.create(
      new Id(req.user.userId),
      createTransactionDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() criteria: FindTransactionsCriteria,
  ) {
    return this.transactionsService.find(new Id(req.user.userId), criteria);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.transactionsService.findById(
      new Id(req.user.userId),
      new Id(id),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  save(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() transactionDto: SaveTransactionDto,
  ) {
    return this.transactionsService.update(new Id(req.user.userId), {
      ...transactionDto,
      id: new Id(id),
    });
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionsService.remove(+id);
  // }
}
