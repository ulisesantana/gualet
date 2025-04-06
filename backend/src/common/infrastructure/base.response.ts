import { Nullable } from '../types';
import { Pagination } from '../infrastructure';

export type BaseResponse<Data, Error> =
  | {
      success: true;
      data: Data;
      error: null;
      pagination: Nullable<Pagination>;
    }
  | {
      success: false;
      data: null;
      error: Error;
      pagination: Nullable<Pagination>;
    };
