import { Nullable } from "@common/domain/types";

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export type BaseResponse<T = object, E = object> =
  | {
      success: true;
      data: T;
      error: null;
      pagination: Nullable<Pagination>;
    }
  | {
      success: false;
      data: null;
      error: E;
      pagination: null;
    };
