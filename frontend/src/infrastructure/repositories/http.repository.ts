import { HttpDataSource } from "@infrastructure/data-sources";
import { CommandResponse, QueryResponse } from "@domain/types";
import { BaseResponse } from "@infrastructure/types";

export abstract class HttpRepository {
  protected constructor(protected readonly http: HttpDataSource) {}

  protected async handleCommandResponse<T extends Record<string, any>>(
    request: Promise<BaseResponse<T, Error>>,
  ): Promise<CommandResponse> {
    try {
      const { success, error } = await request;
      return success
        ? { success: true, error: null }
        : { success: false, error: error.message };
    } catch (error: any) {
      return {
        success: false,
        error:
          error?.response?.data?.error?.message || "An unknown error occurred",
      };
    }
  }

  protected async handleQueryResponse<T extends Record<string, any>>(
    request: Promise<BaseResponse<T, Error>>,
  ): Promise<QueryResponse<T>> {
    try {
      const { success, error, data, pagination } = await request;
      return success
        ? { success: true, error: null, data, pagination }
        : { success: false, error: error.message, data, pagination };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        pagination: null,
        error:
          error?.response?.data?.error?.message || "An unknown error occurred",
      };
    }
  }
}
