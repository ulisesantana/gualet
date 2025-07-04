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
      reason: null;
    }
  | {
      success: false;
      reason: string;
    };

export type QueryResponse<T> =
  | {
      success: true;
      reason: null;
      data: T;
      pagination: Nullable<Pagination>;
    }
  | {
      success: false;
      reason: string;
      data: null;
      pagination: null;
    };
