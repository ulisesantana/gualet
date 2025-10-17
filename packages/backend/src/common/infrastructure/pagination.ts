interface PaginationParams {
  total: number;
  page: number;
  pageSize: number;
}

export class Pagination {
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pages: number;

  constructor({ total, page, pageSize }: PaginationParams) {
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.pages = Math.ceil(total / pageSize);
  }
}
