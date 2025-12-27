import { HttpDataSource } from "@common/infrastructure";
import { CommandResponse, QueryResponse } from "@common/domain/types";
import { BaseResponse } from "@infrastructure/types";

export abstract class HttpRepository {
  protected constructor(protected readonly http: HttpDataSource) {}

  protected async handleCommandResponse<
    T extends Record<string, any> | null | void,
  >(request: Promise<BaseResponse<T, Error>>): Promise<CommandResponse> {
    try {
      const { success, error } = await request;
      return success
        ? { success: true, error: null }
        : {
            success: false,
            error: error?.message || "Failed to execute command",
          };
    } catch (error: any) {
      console.error("HTTP Repository Command Error:", error);
      return {
        success: false,
        error:
          error?.response?.data?.error?.message ||
          error?.response?.data?.error ||
          "An unknown error occurred",
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
        : {
            success: false,
            error: error?.message || "Failed to fetch data",
            data,
            pagination,
          };
    } catch (error: any) {
      // Try to extract error message from various possible structures
      const errorMessage =
        error?.response?.data?.message || // NestJS standard error format
        error?.response?.data?.error?.message || // Custom error format
        error?.message || // Axios error message
        "An unknown error occurred";

      return {
        success: false,
        data: null,
        pagination: null,
        error: errorMessage,
      };
    }
  }
}
