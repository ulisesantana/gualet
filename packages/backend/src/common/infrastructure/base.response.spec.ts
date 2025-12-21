import { BaseResponse } from './base.response';
import { Pagination } from './pagination';

class TestResponse extends BaseResponse<{ message: string }, string> {
  constructor(
    data: { message: string } | null = null,
    error: string | null = null,
    pagination: Pagination | null = null,
  ) {
    super(data, error, pagination);
  }
}

describe('BaseResponse', () => {
  it('should create a successful response with data', () => {
    const response = new TestResponse({ message: 'Success' });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ message: 'Success' });
    expect(response.error).toBeNull();
    expect(response.pagination).toBeNull();
  });

  it('should create an error response', () => {
    const response = new TestResponse(null, 'Error occurred');

    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe('Error occurred');
    expect(response.pagination).toBeNull();
  });

  it('should create a response with pagination', () => {
    const pagination = new Pagination({ page: 1, pageSize: 10, total: 100 });
    const response = new TestResponse({ message: 'Success' }, null, pagination);

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ message: 'Success' });
    expect(response.error).toBeNull();
    expect(response.pagination).toEqual(pagination);
  });
});

