export type Nullable<T> = T | null;

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export type CommandResponse =
  | {
      success: true;
      error: null;
    }
  | {
      success: false;
      error: string;
    };

export type QueryResponse<T> =
  | {
      success: true;
      data: T;
      error: null;
      pagination: Nullable<Pagination>;
    }
  | {
      success: false;
      error: string;
      data: null;
      pagination: null;
    };
