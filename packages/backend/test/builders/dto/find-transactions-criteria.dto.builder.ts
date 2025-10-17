import { FindTransactionsCriteria } from '@src/transactions/dto';

export function buildFindTransactionsCriteria(
  overrides: Partial<FindTransactionsCriteria> = {},
): Required<FindTransactionsCriteria> {
  return {
    page: 1,
    pageSize: 25,
    sort: 'asc',

    ...overrides,
  } as Required<FindTransactionsCriteria>;
}
