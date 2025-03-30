import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { Id } from '@src/common/domain';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
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
  findAll(@Req() req: AuthenticatedRequest) {
    // Create criteria object
    return this.transactionsService.findAll(new Id(req.user.userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.transactionsService.findOne(
      new Id(id),
      new Id(req.user.userId),
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
